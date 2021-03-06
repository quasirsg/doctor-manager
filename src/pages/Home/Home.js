import React, { useEffect, useState, useMemo, useContext } from "react";
import { DataContext } from "../../context/DataContext";

import { map } from "lodash";
import DataTable, { createTheme } from "react-data-table-component";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
//Components
import { Buttons, FilterComponent } from "../../components/DataTable/Buttons";
//Firebase
import firebase from "../../utils/Firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
//css
import "react-confirm-alert/src/react-confirm-alert.css";
//Vars
const columns = [
  {
    name: "Apellido",
    selector: (row) => `${row.surname}`,
    sortable: true,
  },
  {
    name: "Nombre",
    selector: (row) => `${row.name}`,
    sortable: true,
  },
  {
    name: "DNI",
    selector: (row) => `${row.dni}`,
    sortable: true,
  },
  {
    name: "Obra Social  ",
    selector: (row) => `${row.medical_insurance}`,
    sortable: true,
  },
  {
    name: "Edad",
    selector: (row) => `${row.age}`,
    sortable: true,
  },
  {
    name: "Numero de telefono",
    selector: (row) => `${row.phone_number}`,
    sortable: true,
  },
  {
    name: "Acciones",
    sortable: true,
    cell: (row) => (
      <Buttons row={row} confirmAlert={confirmAlert} db={db} toast={toast} />
    ),
  },
];
//Conexion a firestore
const db = firebase.firestore(firebase);

//
const Home = (props) => {
  const { render, setRender } = useContext(DataContext);
  const [pacientes, setPacientes] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const filteredItems = pacientes.filter(
    (item) => item.dni && item.dni.includes(filterText)
  );
  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  useEffect(() => {
    setRender(true);
    db.collection("pacientes")
      .get()
      .then((response) => {
        const arrayPacientes = [];
        map(response?.docs, (paciente) => {
          const data = paciente.data();
          data.id = paciente.id;
          arrayPacientes.push(data);
        });
        setPacientes(arrayPacientes);
      });
  }, [render]);

  return (
    <DataTable
      title="Pacientes"
      columns={columns}
      data={filteredItems}
      pagination
      paginationPerPage={5}
      paginationRowsPerPageOptions={[5, 8, 10]}
      paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
      subHeader
      subHeaderComponent={subHeaderComponentMemo}
      selectableRows
      persistTableHead
      theme="solarized"
    />
  );
};

//Estilos
createTheme("solarized", {
  text: {
    primary: "#268bd2",
    secondary: "#2aa198",
  },
  background: {
    default: "#002b36",
  },
  context: {
    background: "#cb4b16",
    text: "#FFFFFF",
  },
  divider: {
    default: "#073642",
  },
  action: {
    button: "rgba(0,0,0,.54)",
    hover: "rgba(0,0,0,.08)",
    disabled: "rgba(0,0,0,.12)",
  },
});

export default Home;
