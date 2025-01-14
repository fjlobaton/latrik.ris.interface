import { BackButton } from "components/BackButton";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Column, Row, useTable } from "react-table";
import { Gender, Patient } from "models/latrikModels";
import { collection, getFirestore } from "firebase/firestore";
import { useFirestoreCollectionData } from "reactfire";

function PatientList() {
  const patientsRef = collection(getFirestore(), "Patients");
  const patientsCollection = useFirestoreCollectionData(patientsRef);

  const navigate = useNavigate();
  const [patients, setPatients] = React.useState<Patient[]>([]);

  React.useEffect(() => {
    if (patientsCollection.data) {
      const newPatients: any = patientsCollection.data;

      setPatients(newPatients);
    }
  }, [patientsCollection.data]);

  const data = React.useMemo(() => patients, [patients]);

  const columns: Column[] = React.useMemo(() => {
    return [
      {
        Header: "id",
        accessor: "id",
        show: false,
      },
      {
        Header: "Nombre",
        accessor: "name",
      },
      {
        Header: "Doc. de identidad",
        accessor: "patientId", // accessor is the "key" in the data
      },
      {
        Header: "Genero",
        accessor: "gender",
        Cell: ({value}: {value: string}) => <label>{Gender[parseInt(value)]}</label>
      },
      {
        Header: "Fecha de nacimiento",
        accessor: "birthDate",
      },
    ];
  }, []);

  const tableHooks = (hooks: any) => {
    hooks.visibleColumns.push((columns: Column[]) => [
      ...columns,
      {
        id: "Action",
        Header: "Acción",
        Cell: ({ row }: { row: Row }) => {
          return (
            <button
              onClick={() =>
                navigate("/RegisterStudy/", {
                  state: { patientId: row.values.id },
                })
              }
              className="underline text-tertiary font-bold"
              type="button"
            >
              Realizar estudio
            </button>
          );
        },
      },
    ]);
  };

  const tableInstance = useTable(
    { columns, data, initialState: { hiddenColumns: ["id"] } },
    tableHooks
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <>
      <BackButton goTo={"/"} />
      <div className="mx-6 mb-6 flex justify-between">
        <h3 className="font-bold text-4xl">Lista de Pacientes</h3>
        <Link to={"/PatientForm"}>
          <button className="filledPrimary rounded-xl w-44 h-12" type="button">
            Registrar paciente
          </button>
        </Link>
      </div>

      <div className="m-10">
        <table
          {...getTableProps()}
          className="w-full rounded-lg m-auto bg-white"
        >
          <thead className="h-8">
            {
              // Loop over the header rows
              headerGroups.map((headerGroup) => (
                // Apply the header row props
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="bg-primary text-white"
                >
                  {
                    // Loop over the headers in each row
                    headerGroup.headers.map((column) => (
                      // Apply the header cell props
                      <th {...column.getHeaderProps()} className="p-3">
                        {
                          // Render the header
                          column.render("Header")
                        }
                      </th>
                    ))
                  }
                </tr>
              ))
            }
          </thead>
          <tbody {...getTableBodyProps()}>
            {
              // Loop over the table rows
              rows.map((row) => {
                // Prepare the row for display
                prepareRow(row);
                return (
                  // Apply the row props
                  <tr
                    {...row.getRowProps()}
                    className="hover:shadow-tableRowShadow"
                  >
                    {
                      // Loop over the rows cells
                      row.cells.map((cell) => {
                        // Apply the cell props
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="px-5 border border-tertiary p-3"
                            onClick={() => {
                              console.log(cell);
                            }}
                          >
                            {
                              // Render the cell contents
                              cell.render("Cell")
                            }
                          </td>
                        );
                      })
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PatientList;
