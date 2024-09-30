const ESP32_IP = 'ws://192.168.0.182:81'; // La IP del ESP32
    const socket = new WebSocket(ESP32_IP);
    let currentQuestion = 0;
    let totalScore = 0;
    const maxQuestions = 10;
    const answers = []; // Array para almacenar las respuestas
    let selectedSensorValue = null; // Variable para guardar el valor del sensor seleccionado

    const questions = [
      {
        text: "Estás estudiando para un examen importante, pero recibes una notificación en tu teléfono de un mensaje interesante. ¿Qué haces?",
        options: {
          sensorA: "Ignoras el mensaje hasta terminar tu sesión de estudio.",
          sensorB: "Revisas el mensaje rápidamente, pero vuelves a estudiar después.",
          sensorC: "Dejas el estudio de inmediato y revisas el mensaje.",
          sensorD: "Dejas el estudio y ya no estudias nada."
        },
        values: { sensorA: 4, sensorB: 3, sensorC: 2, sensorD: 1 }
      },
      {
        text: "Estás a dieta y pasas frente a una pastelería. Ves un pastel que se ve delicioso. ¿Cómo reaccionas?",
        options: {
          sensorA: "Sigues caminando sin comprar nada, te mantienes enfocado en tus metas.",
          sensorB: "Piensas en tu dieta, pero decides comprar un pedazo pequeño.",
          sensorC: "Entras y compras el pastel, no puedes resistirlo.",
          sensorD: "Compras el pastel y ya de paso abandonas la dieta por mucho tiempo."
        },
        values: { sensorA: 4, sensorB: 3, sensorC: 2, sensorD: 1 }
      },
      {
        text: "Tienes una discusión con un amigo y sientes que te estás enojando mucho. ¿Qué haces?",
        options: {
          sensorA: "Te retiras del lugar para calmarte antes de seguir conversando.",
          sensorB: "Respiras profundo y te calmas un poco, pero sigues discutiendo.",
          sensorC: "Levantas la voz y te dejas llevar por el enojo.",
          sensorD: "Te avientas y se parten su mauser."
        },
        values: { sensorA: 4, sensorB: 3, sensorC: 2, sensorD: 1 }
      },
      {
        text: "Estás trabajando en un proyecto importante, pero te das cuenta de que sientes mucha pereza. ¿Cómo manejas la situación?",
        options: {
          sensorA: "Sigues trabajando a pesar de la pereza, porque sabes que es importante terminar.",
          sensorB: "Te tomas un pequeño descanso, pero vuelves al trabajo después.",
          sensorC: "Decides dejar el proyecto por hoy y haces otra cosa.",
          sensorD: "Abandonas el proyecto para siempre."
        },
        values: { sensorA: 4, sensorB: 3, sensorC: 2, sensorD: 1 }
      },
      {
        text: "Tienes un objetivo financiero, pero ves un producto que te gustaría comprar aunque no lo necesitas. ¿Qué haces?",
        options: {
          sensorA: "Te recuerdas a ti mismo tu objetivo financiero y decides no comprarlo.",
          sensorB: "Piensas en tu objetivo, pero decides comprarlo de todos modos.",
          sensorC: "Lo compras sin pensarlo mucho, es algo que te gusta.",
          sensorD: "Lo compras, compras más cosas y te endeudas."
        },
        values: { sensorA: 4, sensorB: 3, sensorC: 2, sensorD: 1 }
      },
      {
        text: "Estás en una reunión social y te ofrecen alcohol, pero ya has decidido no beber esta vez. ¿Qué haces?",
        options: {
          sensorA: "Rechazas amablemente la oferta y te mantienes firme en tu decisión.",
          sensorB: "Bebes solo un poco para no romper completamente tu decisión.",
          sensorC: "Bebes porque todos lo están haciendo y no quieres quedar fuera.",
          sensorD: "No solo bebes, le haces honor a José José y te pones muy mal."
        },
        values: { sensorA: 4, sensorB: 3, sensorC: 2, sensorD: 1 }
      },
      {
        text: "Te asignan una tarea en grupo, pero un compañero no está cumpliendo con su parte. ¿Cómo reaccionas?",
        options: {
          sensorA: "Lo confrontas de manera calmada, explicándole la importancia de que cada uno haga su parte.",
          sensorB: "Hablas con él, pero haces parte de su trabajo para asegurarte de que todo salga bien.",
          sensorC: "Te enojas y decides hacer su parte por él.",
          sensorD: "Haces todo y te peleas con él después."
        },
        values: { sensorA: 4, sensorB: 3, sensorC: 2, sensorD: 1 }
      },
      {
        text: "Estás viendo una serie que te encanta, pero tienes que levantarte temprano al día siguiente. ¿Qué haces?",
        options: {
          sensorA: "Apagas la televisión y te vas a dormir a la hora planeada.",
          sensorB: "Ves un episodio más, pero luego te obligas a ir a dormir.",
          sensorC: "Sigues viendo la serie hasta muy tarde, no puedes parar.",
          sensorD: "Te maratoneas la serie, no duermes nada y no atiendes tu asunto."
        },
        values: { sensorA: 4, sensorB: 3, sensorC: 2, sensorD: 1 }
      },
      {
        text: "Tienes una presentación importante en unos días, pero tus amigos te invitan a salir la noche anterior. ¿Qué decides?",
        options: {
          sensorA: "Decides no salir y te concentras en preparar la presentación.",
          sensorB: "Sales un rato, pero te aseguras de terminar tu preparación antes.",
          sensorC: "Sales con ellos sin importar que aún no hayas terminado de prepararte.",
          sensorD: "Sales y aun así te molestas con ellos por no hacer tu parte."
        },
        values: { sensorA: 4, sensorB: 3, sensorC: 2, sensorD: 1 }
      },
      {
        text: "Te enfrentas a una crítica injusta en el trabajo o en la escuela. ¿Qué haces?",
        options: {
          sensorA: "Te tomas un momento para pensar antes de responder de forma objetiva.",
          sensorB: "Te molestas, pero tratas de responder de manera más calmada.",
          sensorC: "Respondes inmediatamente y de manera agresiva, defendiendo tu postura.",
          sensorD: "Haces un despapaye y llegas a los golpes."
        },
        values: { sensorA: 4, sensorB: 3, sensorC: 2, sensorD: 1 }
      }
    ];

    function selectSensor(sensor) {
      selectedSensorValue = questions[currentQuestion].values[sensor];
      document.getElementById('result').innerText = "Seleccionaste: " + questions[currentQuestion].options[sensor];
      document.getElementById('nextQuestionBtn').style.display = 'block'; // Mostrar el botón para avanzar
    }

    // Mostrar la primera pregunta inmediatamente
    document.addEventListener("DOMContentLoaded", function() {
      updateQuestionText();
    });

    socket.onopen = function() {
      console.log("Conectado al servidor WebSocket");
      setInterval(fetchSensorData, 500); // Consultar estado de sensores cada medio segundo
    };

    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);

      // Revisar qué sensor está activado y actualizar la variable pero no guardar aún
      if (data.sensorA === 0) {
        selectedSensorValue = questions[currentQuestion].values.sensorA;
        document.getElementById('result').innerText = "Seleccionó: " + questions[currentQuestion].options.sensorA;
      } else if (data.sensorB === 0) {
        selectedSensorValue = questions[currentQuestion].values.sensorB;
        document.getElementById('result').innerText = "Seleccionó: " + questions[currentQuestion].options.sensorB;
      } else if (data.sensorC === 0) {
        selectedSensorValue = questions[currentQuestion].values.sensorC;
        document.getElementById('result').innerText = "Seleccionó: " + questions[currentQuestion].options.sensorC;
      } else if (data.sensorD === 0) {
        selectedSensorValue = questions[currentQuestion].values.sensorD;
        document.getElementById('result').innerText = "Seleccionó: " + questions[currentQuestion].options.sensorD;
      }

      // Cuando se activa el limitSwitchNext, guarda la respuesta seleccionada
      if (data.limitSwitchNext === 1) {
        if (selectedSensorValue !== null) {
          answers.push(selectedSensorValue);
          selectedSensorValue = null; // Reiniciar la selección
          document.getElementById('result').innerText = "Respuesta guardada.";
          currentQuestion++;
          if (currentQuestion < maxQuestions) {
            updateQuestionText();
          } else {
            showFinalScore();
          }
        }
      }
    };

    socket.onclose = function() {
      console.log("Desconectado del servidor WebSocket");
    };

    socket.onerror = function(error) {
      console.error("Error en WebSocket:", error);
    };

    function fetchSensorData() {
      socket.send("getSensors");
    }

    function updateQuestionText() {
      const question = questions[currentQuestion];
      document.getElementById('questionText').innerText = question.text;
      document.getElementById('optionA').innerText = question.options.sensorA;
      document.getElementById('optionB').innerText = question.options.sensorB;
      document.getElementById('optionC').innerText = question.options.sensorC;
      document.getElementById('optionD').innerText = question.options.sensorD;
    }

    function showFinalScore() {
      totalScore = answers.reduce((a, b) => a + b, 0);

      let message = "";
      if (totalScore >= 10 && totalScore <= 20) {
        message = "Tu autocontrol podría mejorar bastante. Tiendes a actuar impulsivamente en varias situaciones. Trabaja en la gratificación retrasada y en estrategias de manejo emocional.";
      } else if (totalScore >= 21 && totalScore <= 30) {
        message = "Tienes un nivel moderado de autocontrol. A veces tomas buenas decisiones, pero podrías mejorar en algunas áreas. Practica técnicas de autorregulación para mantenerte firme en tus decisiones.";
      } else if (totalScore >= 31 && totalScore <= 40) {
        message = "Tienes un excelente autocontrol. Sabes cómo manejar tus emociones y tomar decisiones bien pensadas, lo que te ayuda a mantenerte enfocado en tus metas.";
      }

      document.body.innerHTML = `<h1>Puntuación final: ${totalScore}</h1><p>${message}</p>`;

    }