// Obtiene una referencia al elemento donde se mostrarán las publicaciones
const publicacionesContainer = document.getElementById("publicaciones");
const url = "http://127.0.0.1:3000/data/";
const btnSend = document.getElementById("btnSend");
let btnEditar = document.getElementById("btn-editar");
let idPublicacion = "";

function generarIdAleatorio() {
  return Math.random().toString(36).substring(2);
}
function eliminarMensaje(e) {
  let publicacion = e.target.closest(".info");
  let idPublicacion = publicacion.getAttribute("id");

  fetch(url + idPublicacion, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

document.addEventListener("click", (e) => {
  if (e.target.textContent === "Edit") {
    let publicacion = e.target.closest(".info");
    idPublicacion = publicacion.getAttribute("id");
    let mensajeActual = publicacion.querySelector("p").textContent;
    let inputEditar = document.getElementById("inputTexto");
    btnSend.textContent = "Guardar";
    inputEditar.textContent = mensajeActual;
  }
});

try {
  fetch(url, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((info) => {
        const publicacionDiv = document.createElement("div");
        publicacionDiv.id = info.id;
        publicacionDiv.classList.add("info");

        const usuario = document.createElement("h4");
        usuario.textContent = info.usuario;

        const mensaje = document.createElement("p");
        mensaje.textContent = info.mensaje;
        mensaje.classList.add("msg");

        const fotoPerfilImg = document.createElement("img");
        fotoPerfilImg.src = info["foto-perfil"];
        fotoPerfilImg.alt = `Foto de perfil de ${info.usuario}`;

        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Delete";
        btnDelete.classList.add("deleteBtn");
        btnDelete.onclick = eliminarMensaje;

        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Edit";
        btnEdit.classList.add("editBtn");

        publicacionDiv.appendChild(usuario);
        publicacionDiv.appendChild(mensaje);
        publicacionDiv.appendChild(fotoPerfilImg);
        publicacionDiv.appendChild(btnDelete);
        publicacionDiv.appendChild(btnEdit);

        publicacionesContainer.appendChild(publicacionDiv);
      });
    });
} catch (error) {
  console.error("error:", error);
}

btnSend.addEventListener("click", function (e) {
  const inputTexto = document.getElementById("inputTexto").value;
  if (btnSend.textContent === "SEND") {
    const idAleatorio = generarIdAleatorio();
    const dataPost = {
      id: idAleatorio,
      mensaje: inputTexto,
      usuario: "chito",
      "foto-perfil":
        "https://lh3.googleusercontent.com/-EDgv4PRz7ts/AAAAAAAAAAI/AAAAAAAAAAA/AFsW0b5pFcyYpV-leK5Vthk3OrChC6doag/photo.jpg?sz=46",
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataPost),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
      });
  }
  if (btnSend.textContent === "Guardar") {
    let mensajeEditado = document.getElementById("inputTexto").value;
    // console.log(idPublicacion)
    // console.log(mensajeEditado)
    let mensajeActualizado = {
      mensaje: mensajeEditado,
      usuario: "chito",
      "foto-perfil":
        "https://lh3.googleusercontent.com/-EDgv4PRz7ts/AAAAAAAAAAI/AAAAAAAAAAA/AFsW0b5pFcyYpV-leK5Vthk3OrChC6doag/photo.jpg?sz=46",
    };

    let requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mensajeActualizado),
    };

    fetch(url + idPublicacion, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
    btnSend.textContent = "SEND";
  }
});
