// commented out for BUILD errors

// import { parse } from "csv-parse";
// import { readFile, writeFile } from "fs";
// import { join } from "path";

// readFile(join(__dirname, "../public/final_properties_v1.csv"), (err, data) => {
//   parse(data, (err, data) => {
//     const header = data.shift();

//     writeFile(
//       join(__dirname, "../public/final_properties_v1_2.json"),
//       JSON.stringify(
//         data.map((x) => ({
//           block: Number(x[0]),
//           lot: Number(x[1]),
//           lat: Number(x[2]),
//           lon: Number(x[3]),
//           propertyLocation: x[4],
//           grantor: x[5],
//           grantee: x[6],
//         })),
//         null,
//         2,
//       ),
//       () => console.log("done"),
//     );
//   });
// });
