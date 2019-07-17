import {Observable} from "rxjs";
import {query} from "../../config/sql.config";
import {Attribute} from "../models/attribute";

export let byApplication = (req: {applicationId: number, requirementTypeId?: number}) => {
  return new Observable((observer) => {
    const columns = ["LAOA.id_app_object_attribute", "LA.id_attribute", "name_attribute", "type_attribute", "system_attribute", "LAV.value_attribute"],
          sql = `SELECT ?? FROM light_app_object_attribute LAOA LEFT JOIN light_object_attribute LOA ON LAOA.id_object_attribute=LOA.id_object_attribute LEFT JOIN light_attribute LA ON LOA.id_attribute=LA.id_attribute LEFT JOIN light_attribute_value LAV ON LAV.id_attribute=LA.id_attribute WHERE LAOA.id_app=?${req.requirementTypeId ? " AND LAOA.id_object=?" : ""} AND LAOA.active=1;`;
    // TODO: modify query to remove 'null' rows
    query(sql, [columns, req.applicationId, req.requirementTypeId]).subscribe((rows: any[]) => {
      let attribute: Attribute, attributes: Attribute[] = [];
      rows.forEach((row) => {
        if (row.id_attribute) {
          if (!attribute || attribute.id !== row.id_attribute) {
            attribute = new Attribute();
            attribute.appObjectAttributeId = row.id_app_object_attribute;
            attribute.id = row.id_attribute;
            attribute.name = row.name_attribute;
            attribute.type = row.type_attribute;
            attribute.system = row.system_attribute;
            attribute.values = [];
            attributes.push(attribute);
          }
          attribute.values.push(row.value_attribute || "");
        }
      });
      observer.next(attributes);
    }, (err) => observer.error(err), () => observer.complete());
  });
};
