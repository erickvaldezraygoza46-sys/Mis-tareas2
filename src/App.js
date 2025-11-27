import React, { useState } from 'react';// react
import './App.css';// css
// COMPOSICIÓN DEL COMPONENTE PRINCIPAL
function App() {// componente principal
  const [view, setView] = useState('login');// 'login', 'register', 'forgot', 'home', 'tasks', 'share', 'config', 'detail'
  const [user, setUser] = useState({ nombre: '', ocupacion: '', email: '' });// usuario
  const [projects, setProjects] = useState([]);// proyectos
  const [projectInput, setProjectInput] = useState('');// input proyecto
  const [descInput, setDescInput] = useState('');// input descripción
  const [selectedProject, setSelectedProject] = useState(null);// proyecto seleccionado
  const [theme, setTheme] = useState('light');// tema
  const [shareLink, setShareLink] = useState('');// enlace para compartir
  // Cargar proyectos desde MySQL
  async function loadProjects(id) {// cargar proyectos desde MySQL
    const res = await fetch(`http://localhost/portafolio_api/get_projects.php?id_usuario=${id}`);// fetch proyectos desde MySQL
    const json = await res.json();// convertir a json
    setProjects(json);// set proyectos
  }// cargar proyectos desde MySQL
  // Eliminar proyecto
  async function deleteProject(id) {// eliminar proyecto
    const form = new FormData();// crear formulario
    form.append("id", id);// agregar id al formulario
// enviar solicitud para eliminar proyecto
    const res = await fetch("http://localhost/portafolio_api/delete_project.php", {// fetch eliminar proyecto
      method: "POST",// método post
      body: form,// cuerpo del formulario
    });// fetch eliminar proyecto
// procesar respuesta
    const json = await res.json();// convertir a json
    if (json.success) {// si éxito
      loadProjects(user.id);// recargar proyectos
    } else {// si error
      alert("No se pudo eliminar");// alert error
    }// si error
  }// eliminar proyecto
// RENDERIZADOS 
  //LOGIN REAL CON PHP 
  const renderLogin = () => (// login en PHP
    <div className="form-container fade-in">
      <form
        onSubmit={async e => {
          e.preventDefault();// evitar recarga de página
          const data = new FormData(e.target);// obtener datos del formulario
// enviar solicitud de login
          const res = await fetch("http://localhost/portafolio_api/login.php", {// fetch login
            method: "POST",// método post
            body: data// cuerpo del formulario
          });// fetch login
// procesar respuesta
          const json = await res.json();// convertir a json
          if (json.success) {// si éxito
            setUser(json.user);// set usuario
            loadProjects(json.user.id);// cargar proyectos
            setView('home');// ir a home
          } else {// si error
            alert("Datos incorrectos");// alert error
          }// si error
        }}
      >
        <input name="email" type="email" placeholder="Correo electrónico" required />
        <input name="password" type="password" placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
      </form>

      <p>
        <button className="link-btn" onClick={() => setView('forgot')}>
          ¿Olvidaste tu contraseña?
        </button>
      </p>
      <p>
        ¿No tienes cuenta?{' '}
        <button className="link-btn" onClick={() => setView('register')}>
          Regístrate
        </button>
      </p>
    </div>
  );

  //REGISTRO REAL CON PHP
  const renderRegister = () => (// registro en PHP eslint-disable-next-line
    <div className="form-container fade-in">
      <h2>Registrarse</h2>
      <form
        onSubmit={async e => {// enviar solicitud de registro
          e.preventDefault();// evitar recarga de página
          const data = new FormData(e.target);// obtener datos del formulario
// enviar solicitud de registro
          const res = await fetch("http://localhost/portafolio_api/registro.php", {// fetch registro
            method: "POST",// método post
            body: data// cuerpo del formulario
          });// fetch registro
// procesar respuesta
          const json = await res.json();// convertir a json
// si éxito
          if (json.success) {// si éxito
            alert("Cuenta creada");// alert éxito
            setView('login');// ir a login
          } else {// si error
            alert("Error al registrarse");// alert error
          }// si error
        }}  
      >
        <input name="nombre" type="text" placeholder="Nombre completo" required />
        <input name="ocupacion" type="text" placeholder="Ocupación" required />
        <input name="email" type="email" placeholder="Correo electrónico" required />
        <input name="password" type="password" placeholder="Contraseña" required />
        <button type="submit">Crear cuenta</button>
      </form>
      <p>
        ¿Ya tienes cuenta?{' '}
        <button className="link-btn" onClick={() => setView('login')}>
          Inicia sesión
        </button>
      </p>
    </div>
  );

  //RECUPERAR CONTRASEÑA
  const renderForgot = () => (// recuperar contraseña
    <div className="form-container fade-in">
      <h2>Recuperar contraseña</h2>
      <form onSubmit={e => { e.preventDefault(); setView('login'); }}>
        <input type="email" placeholder="Correo electrónico" required />
        <button type="submit">Enviar enlace</button>
      </form>
      <button className="main-btn" onClick={() => setView('login')}>Volver</button>
    </div>
  );

  //CARRUSEL NUEVO 
  const Carousel = () => (// carrusel
    <div className="carousel">
      {projects.map((p, i) => (
        <div key={i} className="carousel-item">
          <img
            src={`http://localhost/portafolio_api/${p.imagen}`}// imagen del proyecto
            alt={p.nombre}// alt del proyecto
            className="carousel-img"// clase de la imagen
          />
          <p>{p.nombre}</p>
        </div>
      ))}
    </div>
  );

  //HOME
  const renderHome = () => (// inicio de la app
    <>
      <header className="App-header">{/* encabezado */}
        <h1 className="fade-in">{user.nombre}</h1>{/* nombre del usuario */}
        <p className="fade-in delay-1">{user.ocupacion}</p>{/* ocupación del usuario */}
{/* menú desplegable */}
        <div className="dropdown">{/* menú desplegable */}
          <button className="main-btn" onClick={() => setView('config')}>{/* botón configuraciones */}
            Configuraciones{/* botón configuraciones */}
          </button>
          <button className="main-btn" onClick={() => setView('share')}>{/* botón compartir */}
            Compartir{/* botón compartir */}
          </button>
        </div>
      </header>

      <section className="Projects-section fade-in delay-2">{/* sección de proyectos */}
        <h2>Proyectos</h2>{/* título de la sección */}

        {/* CARRUSEL */}
        <Carousel />
        <ul>
          {projects.map((p, i) => (// listar proyectos
            <li key={i} className="project-card">{/* tarjeta de proyecto */}
              <strong>{p.nombre}</strong> — {p.descripcion}{/* nombre y descripción del proyecto */}
              <button
                className="delete-btn"// botón eliminar
                onClick={() => deleteProject(p.id)}// eliminar proyecto
              >
                Eliminar{/* botón eliminar */}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <button className="main-btn" onClick={() => setView('tasks')}>{/* botón agregar proyecto */}
        Agregar Proyecto{/* botón agregar proyecto */}
      </button>

      <footer className="App-footer fade-in delay-5">{/* pie de página */}
        <p>Contacto: <a href={`mailto:${user.email}`}>{user.email}</a></p>{/* contacto del usuario */}
      </footer>
    </>
  );

  //AGREGAR PROYECTO CON IMAGEN
  const renderTasks = () => (// agregar proyecto con imagen
    <div className="form-container fade-in">{/* contenedor del formulario */}
      <h2>{user.nombre}</h2>{/* nombre del usuario */}
      <p>{user.ocupacion}</p>{/* ocupación del usuario */}
{/* formulario para agregar proyecto */}
      <form
        onSubmit={async e => {// enviar solicitud para agregar proyecto
          e.preventDefault();// evitar recarga de página
// crear formulario
          const form = new FormData();// crear formulario
          form.append("id_usuario", user.id);// agregar id usuario al formulario
          form.append("nombre", projectInput);// agregar nombre del proyecto al formulario
          form.append("descripcion", descInput);// agregar descripción del proyecto al formulario
          form.append("imagen", e.target.imagen.files[0]);// agregar imagen del proyecto al formulario
// enviar solicitud para agregar proyecto
          const res = await fetch("http://localhost/portafolio_api/add_project.php", {// fetch agregar proyecto
            method: "POST",// método post
            body: form// cuerpo del formulario
          });// fetch agregar proyecto
// procesar respuesta
          const json = await res.json();// convertir a json
// si éxito
          if (json.success) {// si éxito
            loadProjects(user.id);// recargar proyectos
            setProjectInput('');// limpiar input nombre
            setDescInput('');// limpiar input descripción
            setView('home');// ir a home
          } else {// si error
            alert("No se pudo agregar");// alert error
          }// si error
        }}
      >
        <input
          type="text"// input texto
          value={projectInput}// valor del input
          onChange={e => setProjectInput(e.target.value)}// cambiar valor del input
          placeholder="Nombre del proyecto"// placeholder
          required// requerido
        />{/* input nombre del proyecto */}
        <input
          type="text"// input texto
          value={descInput}// valor del input
          onChange={e => setDescInput(e.target.value)}// cambiar valor del input
          placeholder="Descripción del proyecto"// placeholder
          required// requerido
        />

        <input type="file" name="imagen" accept="image/*" />{/* input archivo imagen */}
{ /* espacio para comentarios adicionales si es necesario */ }
        <button type="submit">Agregar</button>{/* botón agregar */}
      </form>

      <button className="main-btn" onClick={() => setView('home')}>{/* botón volver al inicio */}
        Volver al inicio{/* botón volver al inicio */}
      </button>
    </div>
  );
  // === CONFIG ===
  const renderConfig = () => (// configuraciones
    <div className="form-container fade-in">{/* contenedor del formulario */}
      <h2>Configuraciones</h2>{/* título */}
      <button className="main-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{/* botón cambiar tema */}
        Cambiar tema{/* botón cambiar tema */}
      </button>{/* botón cambiar tema */}
      <button className="main-btn" onClick={() => setView('home')}>{/* botón volver al inicio */}
        Volver al inicio{/* botón volver al inicio */}
      </button>
    </div>
  );
  //COMPARTIR
  const renderShare = () => (// compartir proyecto
    <div className="form-container fade-in">{/* contenedor del formulario */}
      <h2>Compartir proyecto</h2>{/* título */}

      <form
        onSubmit={e => {// generar enlace para compartir
          e.preventDefault();// evitar recarga de página
          setShareLink(`https://portafolio.com/proyecto/${encodeURIComponent(e.target.project.value)}`);// generar enlace
        }}
      >
        <select name="project" required>{/* seleccionar proyecto */}
          {projects.map((p, i) => (// opciones de proyectos
            <option key={i} value={p.nombre}>{p.nombre}</option>// opción de proyecto
          ))}
        </select>{/* seleccionar proyecto */}
        <button type="submit">Generar enlace</button>{/* botón generar enlace */}
      </form>

      {shareLink && (// si hay enlace generado
        <div style={{ marginTop: "1rem" }}>
          <p>Enlace:</p>
          <a href={shareLink} target="_blank" rel="noopener noreferrer">{shareLink}</a>
        </div>
      )}

      <button className="main-btn" onClick={() => setView('home')}>
        Volver al inicio{/* botón volver al inicio */}
      </button>
    </div>
  );
  //DETALLE
  const renderDetail = () => (// detalle del proyecto
    <div className="form-container fade-in">{/* contenedor del formulario */}
      <h2>Detalle</h2>{/* título */}
      {selectedProject && (// si hay proyecto seleccionado
        <>
          <h3>{selectedProject.nombre}</h3>
          <p>{selectedProject.descripcion}</p>
        </>
      )}
      <button className="main-btn" onClick={() => setView('home')}>{/* botón volver al inicio */}
        Volver
      </button>
    </div>
  );

  React.useEffect(() => {// efecto para cambiar tema
    document.body.className = theme === 'dark' ? 'dark-theme' : '';// cambiar clase del body segun tema
  }, [theme]);// efecto para cambiar tema
// RENDER PRINCIPAL
  return (// render principal
    <div className="App">
      {view === 'login' && renderLogin()}
      {view === 'register' && renderRegister()}
      {view === 'forgot' && renderForgot()}
      {view === 'home' && renderHome()}
      {view === 'tasks' && renderTasks()}
      {view === 'share' && renderShare()}
      {view === 'config' && renderConfig()}
      {view === 'detail' && renderDetail()}
    </div>
  );// render principal
}
// EXPORTAR COMPONENTE
export default App;