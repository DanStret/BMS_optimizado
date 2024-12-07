const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // Necesario para leer JSON en el body de las peticiones

// Conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'usbw',
  database: 'sistemapresurizacion',
});

// Ruta para obtener el estado del sistema
app.get('/system-status/:systemId', (req, res) => {
  const systemId = req.params.systemId;

  const query = `
    SELECT name, color, status, type
FROM (
    -- Últimos datos únicos de señales (signals)
    SELECT s1.name, s1.color, s1.status, 'signal' AS type
    FROM signals s1
    INNER JOIN (
        SELECT name, MAX(updated_at) AS latest_update
        FROM signals
        WHERE system_id = 1
        GROUP BY name
    ) s2
    ON s1.name = s2.name AND s1.updated_at = s2.latest_update
    WHERE s1.system_id = 1

    UNION ALL

    -- Últimos datos únicos de estados (statuses)
    SELECT st1.name, st1.color, st1.active AS status, 'state' AS type
    FROM statuses st1
    INNER JOIN (
        SELECT name, MAX(updated_at) AS latest_update
        FROM statuses
        WHERE system_id = 1
        GROUP BY name
    ) st2
    ON st1.name = st2.name AND st1.updated_at = st2.latest_update
    WHERE st1.system_id = 1

    UNION ALL

    -- Últimos datos del selector (selectors)
    SELECT mode AS name, NULL AS color, NULL AS status, 'selector' AS type
    FROM (
        SELECT mode, updated_at
        FROM selectors
        WHERE system_id = 1
        ORDER BY updated_at DESC
        LIMIT 1
    ) latest_selector
) AS combined
ORDER BY type, name;

  `;

  connection.query(query, [systemId, systemId, systemId, systemId, systemId], (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    // Separar datos en categorías
    const signals = results.filter(item => item.type === 'signal').map(item => ({
      name: item.name,
      color: item.color,
      status: item.status
    }));

    const states = results.filter(item => item.type === 'state').map(item => ({
      name: item.name,
      color: item.color,
      status: item.status
    }));

    const selector = results.find(item => item.type === 'selector') || { name: "MANUAL" };

    res.json({ signals, states, selector });
  });
});


// Ruta para cambiar el modo del selector
app.post('/toggle-selector', (req, res) => {
  const { mode } = req.body;

  const query = `
    UPDATE selectors SET mode = ?
    WHERE system_id = 1;  -- Cambiar según el ID del sistema
  `;

  connection.query(query, [mode], (err) => {
    if (err) {
      console.error('Error actualizando el modo del selector:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    res.json({ message: 'Modo actualizado correctamente' });
  });
});

// Nueva ruta para recibir comandos desde el frontend y almacenarlos en la base de datos
app.post('/send-command', (req, res) => {
  const { dispositivo, comando, estado } = req.body;

  // Validación básica
  if (!dispositivo || !comando || !estado) {
    return res.status(400).json({ error: "Datos incompletos en la solicitud" });
  }

  // Insertar el comando en la tabla control_comandos
  const query = `
    INSERT INTO control_comandos (dispositivo, comando, estado)
    VALUES (?, ?, ?)
  `;
  connection.query(query, [dispositivo, comando, estado], (error) => {
    if (error) {
      return res.status(500).json({ error: "Error al guardar el comando en la base de datos" });
    }
    res.status(201).json({ message: "Comando guardado correctamente" });
  });
});

// Ruta para obtener el estado de dispositivos
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

// Ruta para obtener indicadores
app.get('/indicadores', (req, res) => {
  connection.query(
    'SELECT tensionMotor, tensionDC, corriente, potencia, frecuencia, temperatura, ia, av FROM prezurizacion ORDER BY timestamp DESC LIMIT 1',
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Error en la base de datos" });
      }
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.json({
          tensionMotor: 0,
          tensionDC: 0,
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

// Iniciar servidor
app.listen(port, () => {
  console.log(`API ejecutándose en http://localhost:${port}`);
});
