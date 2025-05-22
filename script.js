const URL_CANDIDATOS = "https://raw.githubusercontent.com/CesarMCuellarCha/Elecciones/refs/heads/main/candidatos.json";
const URL_ADMIN = "https://raw.githubusercontent.com/CesarMCuellarCha/Elecciones/refs/heads/main/administrador.json";

let arregloCandidatos = [];
let administrador = {};
let votos = {};

    document.addEventListener("DOMContentLoaded", async () => {
        await cargarDatos();
        cargarVotosDesdeStorage();
        mostrarCandidatos();
        document.getElementById("btnCerrar").addEventListener("click", cerrarElecciones);
    });

async function cargarDatos() {
    try {
        const resCandidatos = await fetch(URL_CANDIDATOS);
        arregloCandidatos = await resCandidatos.json();

        const resAdmin = await fetch(URL_ADMIN);
        administrador = await resAdmin.json();

        arregloCandidatos.forEach(c => {
        if (!(c.nombre in votos)) {
            votos[c.nombre] = 0;
        }
        });

        guardarVotosEnStorage();

        console.log("Candidatos cargados:", arregloCandidatos);
        console.log("Administrador:", administrador);
        console.log("Votos actuales:", votos);

    } catch (error) {
        alert("Error al cargar datos desde la API");
        console.error("Error en carga de datos:", error);
    }
}

function mostrarCandidatos() {
    const contenedor = document.getElementById("candidatos");
    contenedor.innerHTML = "";

    arregloCandidatos.forEach(candidato => {
        const div = document.createElement("div");
        div.className = "candidato";
        div.onclick = () => votar(candidato.nombre);

        div.innerHTML = `
            <strong>${candidato.curso}</strong>
            <div class="foto">Aquí la Foto</div>
            <div class="info">
                <p>Aprendiz: ${candidato.nombre} ${candidato.apellido}</p>
                <p>Ficha: ${candidato.ficha}</p>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

function votar(nombre) {
    const confirmar = confirm(`¿Estás seguro de que quieres votar por ${nombre}?`);
    if (confirmar) {
        votos[nombre]++;
        guardarVotosEnStorage();
        console.log(`Voto registrado por: ${nombre}`);
        console.log("Votos actualizados:", votos);
        alert(`Tu voto por ${nombre} fue registrado correctamente.`);
    }
}

function cerrarElecciones() {
    const usuario = prompt("Ingresa el usuario del administrador para cerrar elecciones:");
    if (usuario !== administrador.usuario) {
        alert("No tienes permiso para cerrar las elecciones.");
        return;
    }

    const resultado = document.getElementById("resultados");
    resultado.innerHTML = "<h2>Resultados Finales</h2>";

    for (let nombre in votos) {
        resultado.innerHTML += `<p>${nombre}: ${votos[nombre]} votos</p>`;
    }

    localStorage.removeItem("votos");
    console.log("Elecciones cerradas. Resultados:", votos);
}

function guardarVotosEnStorage() {
    localStorage.setItem("votos", JSON.stringify(votos));
}

function cargarVotosDesdeStorage() {
    const votosGuardados = localStorage.getItem("votos");
    if (votosGuardados) {
        votos = JSON.parse(votosGuardados);
    }
}