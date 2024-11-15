const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // Necesario para leer JSON en el body de las peticiones

// Conexión a la base de datos
const connection = mysql.createConnection({
  host: 'dataaws.cbqmua0skt3i.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'admin123',
  database: 'dataaws',
});

// Ruta para obtener el estado del LED
app.get('/led-status', (req, res) => {
  connection.query(
    'SELECT color FROM indicadores ORDER BY timestamp DESC LIMIT 1', 
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Error en la base de datos" });
      }
      if (results.length > 0) {
        res.json({ color: results[0].color });
      } else {
        res.json({ color: "rojo" }); // Valor por defecto si no hay resultados
      }
    }
  );
});

// Nueva ruta para recibir comandos desde el frontend y almacenarlos en la base de datos
app.post('/send-command', (req, res) => {
  const { dispositivo, comando, estado } = req.body; // Leer los datos del cuerpo de la petición

  // Validación básica
  if (!dispositivo || !comando || !estado) {
    return res.status(400).json({ error: "Datos incompletos en la solicitud" });
  }

  // Insertar el comando en la tabla control_comandos
  const query = `
    INSERT INTO control_comandos (dispositivo, comando, estado)
    VALUES (?, ?, ?)
  `;
  connection.query(query, [dispositivo, comando, estado], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error al guardar el comando en la base de datos" });
    }
    res.status(201).json({ message: "Comando guardado correctamente" });
  });
});


app.get('/device-status', (req, res) => {
  const dispositivos = ['Variador', 'Rele 1', 'Ramp', 'Reverse'];
  const promises = dispositivos.map(dispositivo => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT estado FROM control_comandos WHERE dispositivo = ? ORDER BY timestamp DESC LIMIT 1',
        [dispositivo],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          if (results.length > 0) {
            resolve({ dispositivo, estado: results[0].estado });
          } else {
            resolve({ dispositivo, estado: 'OFF' });
          }
        }
      );
    });
  });

  Promise.all(promises)
    .then(results => res.json(results))
    .catch(error => res.status(500).json({ error: 'Error en la base de datos' }));
});

app.get('/indicadores', (req, res) => {
  connection.query(
    'SELECT tensionMotor, tensionDC	, corriente, potencia, frecuencia, temperatura, ia, av FROM prezurizacion ORDER BY timestamp DESC LIMIT 1',
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Error en la base de datos" });
      }
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.json({
          tensionMotor: 0,
          tensionDC	: 0,
          corriente: 0,
          potencia: 0,
          frecuencia: 0,
          temperatura: 0,
          ia: 0,
          av: 0
        });
      }
    }
  );
});



app.listen(port, () => {
  console.log(`API ejecutándose en http://localhost:${port}`);
});
