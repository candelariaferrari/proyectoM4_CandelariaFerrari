# Uso de IA en el desarrollo del proyecto

Usé Claude (Anthropic) como asistente de desarrollo a lo largo de este proyecto. Este documento reconstruye, a partir de sesiones reales, los prompts más representativos, el contexto de cada uno y qué decidí yo a partir de las respuestas. No es una transcripción palabra por palabra de todo el chat (fueron muchas sesiones), pero cada punto acá corresponde a un intercambio real, no inventado.

Cada apartado resume el contexto técnico, el objetivo planteado, el prompt utilizado y las decisiones que tomé luego de analizar las respuestas obtenidas. No se trata de una transcripción literal de todas las conversaciones, sino de una síntesis fiel del proceso de trabajo seguido durante el proyecto.

Como criterio general, utilicé la IA para resolver dudas técnicas, validar enfoques, identificar errores y comparar alternativas de implementación. Las decisiones de diseño, la validación de las soluciones propuestas y la integración final en el proyecto fueron realizadas por mí.

**Nota:** La parte visual (CSS y ajustes de UX/UI) fue desarrollada mayormente por mí. Solo recurrí a la IA cuando encontré bugs específicos o necesitaba analizar un problema puntual que no podía resolver inmediatamente.

## Configuración de testing (Vitest + TypeScript)

**Contexto:**

Proyecto desarrollado con React, Vite, TypeScript y Vitest. Al finalizar la implementación de los primeros tests, el proyecto compilaba con errores y los archivos ubicados en tests/ no estaban siendo tipados correctamente.

**Prompt (resumido)**

Estoy configurando Vitest en un proyecto React + Vite + TypeScript. Al ejecutar tsc -b obtengo un error en vite.config.ts relacionado con la propiedad test de defineConfig.

Necesito identificar el origen del problema y configurar correctamente TypeScript para que también incluya los archivos de la carpeta tests, sin afectar la configuración existente del proyecto. Explicame qué cambios son necesarios y por qué.

**Qué decidí**

Identificamos que Vitest 4 requería actualizar la referencia de tipos (vitest/config) y que tsconfig.app.json únicamente contemplaba la carpeta src. Antes de aplicar los cambios entendí el motivo de cada uno y luego verifiqué el resultado ejecutando nuevamente la suite completa de tests, comprobando que los 33 pasaban correctamente.


## Corrección de alineación en TaskItem
**Contexto**
Durante las pruebas visuales observé que las tarjetas de tareas no mantenían una alineación consistente. La fecha límite y la prioridad cambiaban de posición según la longitud del contenido, generando una interfaz desprolija.

**Prompt**
Detecté un problema de alineación en el componente TaskItem.
La fecha límite y la prioridad no quedan alineadas entre las distintas tarjetas porque el contenido tiene diferentes anchos.
Necesito una solución que:
mantenga alineados todos los elementos;
no modifique el comportamiento responsive;
conserve la estructura actual del componente;
priorice una solución mediante CSS antes que modificar la lógica del componente.

**Qué decidí**
La primera propuesta resolvía el problema alineando el contenido hacia la derecha. Después de revisar el resultado visual consideré que no respetaba la estética que buscaba para la aplicación, por lo que descarté esa alternativa y solicité una nueva solución alineada hacia la izquierda.
Solo incorporé la segunda propuesta después de verificar visualmente que mantenía la consistencia entre todas las tarjetas.

## Diseño del email de resumen (texto plano vs HTML)
**Contexto**
El proyecto incorpora el envío de un resumen semanal mediante AWS SES. La función buildTodoSummary() era la encargada de generar el contenido del correo electrónico y surgió la duda sobre cuál era el formato más conveniente para implementarlo.

**Prompt**
Estoy implementando el envío del resumen semanal mediante AWS SES.
Quiero evaluar si conviene generar el correo como texto plano o como HTML.
En caso de utilizar HTML, necesito que conserve la identidad visual de la aplicación, pero que siga siendo compatible con la mayoría de los clientes de correo y resulte sencillo de mantener.
Antes de proponer una implementación, explicame las ventajas y desventajas de cada alternativa.

**Qué decidí**
Después de analizar las distintas opciones decidí utilizar un diseño HTML sencillo con identidad visual propia ("branded simple"), priorizando la compatibilidad y el mantenimiento del código por encima de replicar exactamente la interfaz de la aplicación.
La decisión final fue tomada considerando el equilibrio entre experiencia de usuario, simplicidad de implementación y facilidad de mantenimiento.


## Revisión propia de bugs de UI antes de pedir ayuda
**Contexto**
Luego de implementar varias funcionalidades, realicé una revisión manual completa de la aplicación para detectar problemas de interfaz y experiencia de usuario antes de considerar finalizada la etapa visual.
Durante esa revisión encontré distintos comportamientos que afectaban la usabilidad, principalmente en la versión mobile.

**Prompt**
Realicé una revisión completa de la aplicación y detecté varios problemas de interfaz que quiero resolver de forma ordenada.
Los inconvenientes encontrados son:
    - El mensaje "Sin tareas" aparece aunque existan tareas completadas.
    - El Bottom Navigation necesita una mejor distribución.
    - En dispositivos móviles algunos textos del componente TaskItem se superponen.
    - El botón para crear tareas no tiene una ubicación cómoda en mobile.
    - El título "Mis tareas" debería mantenerse en una única línea.
    - El contenido final de la página queda oculto detrás del Bottom Navigation al hacer scroll.

Quiero analizar cada problema por separado, priorizando soluciones simples que mantengan la arquitectura actual del proyecto y sin introducir cambios innecesarios.

**Qué decidí**
Cada corrección fue validada visualmente antes de continuar con la siguiente, evitando aplicar múltiples cambios simultáneamente sin comprobar su impacto.


## Auditoría del proyecto utilizando la rúbrica de evaluación
**Contexto**
Una vez finalizadas las funcionalidades principales y las correcciones visuales, quería verificar que el proyecto cumpliera todos los requisitos solicitados por la consigna antes de realizar la entrega.

**Prompt**
Considerando la rúbrica de evaluación del proyecto integrador, necesito revisar si todavía existe algún requisito pendiente de implementar o documentar.
No busco agregar funcionalidades innecesarias, sino identificar posibles faltantes respecto a la consigna oficial y justificar cada sugerencia antes de incorporarla.

**Qué decidí**
La revisión permitió detectar dos aspectos pendientes:
 - incorporar un test específico para el componente TaskList, que aún no tenía cobertura propia;
 - completar la documentación de .env.example agregando las variables correspondientes a AWS.

Antes de realizar esos cambios confirmé que respondían a requisitos reales de la rúbrica y no simplemente a recomendaciones generales.

Además, cuando surgió la propuesta de agregar un nuevo test, consulté si eso implicaba que los existentes eran innecesarios. Quise comprender el criterio detrás de la sugerencia antes de aceptarla y entendí que el objetivo era mejorar la cobertura del proyecto, no aumentar la cantidad de tests sin un propósito claro.

## Incorporación de observaciones surgidas durante una revisión en vivo
**Contexto**
Durante una clase de seguimiento del proyecto, el profesor realizó una revisión funcional de la aplicación y señaló algunos aspectos relacionados con la experiencia de usuario que podían mejorarse antes de la entrega final.

**Prompt**
Durante una revisión del proyecto recibí las siguientes observaciones:
 - Al eliminar una tarea no existe un indicador visual mientras la operación está en curso.
 - Al crear una tarea tampoco se informa al usuario que la acción se está procesando.
 - Las pantallas Dashboard y Resumen muestran información redundante.

Quiero resolver cada observación por separado, manteniendo la arquitectura actual de la aplicación y verificando posteriormente que todos los cambios respondan a los criterios de evaluación del proyecto.

**Qué decidí**
Tomé las observaciones como una lista de mejoras priorizadas y trabajé cada una de forma independiente.
Una vez implementadas, realicé una nueva revisión del proyecto para comprobar que:

 - el estado de eliminación mostrara un feedback visual mediante pending en TaskItem;
 - el formulario indicara el estado "Guardando..." durante la creación de una tarea;
 - la información redundante entre Dashboard y Resumen hubiera sido eliminada.

De esta manera, las observaciones quedaron resueltas y posteriormente fueron verificadas durante la revisión final del proyecto.


## Flujo de trabajo con Git
**Contexto** 
A medida que iba resolviendo funcionalidades y corrigiendo bugs, necesitaba mantener un historial de cambios claro que facilitara el seguimiento del desarrollo y permitiera identificar rápidamente el objetivo de cada modificación.

**Prompt**
Quiero mantener un historial de commits limpio y fácil de entender durante todo el desarrollo del proyecto.
¿Qué estrategia de versionado me recomendás para registrar funcionalidades, correcciones de errores, cambios de estilos, refactors y tests?
Busco una convención consistente que facilite revisar el historial del proyecto y documente la evolución del desarrollo.

**Qué decidí**
Como criterio de trabajo establecí realizar un commit por cada bug corregido o funcionalidad implementada, utilizando prefijos semánticos (feat:, fix:, style:, refactor:, test: y chore:) para mantener un historial claro y consistente.

## Diagnóstico de una demora al conectar con Firebase
**Contexto** 
Durante las primeras pruebas de la aplicación, observé que el estado "Cargando tareas..." permanecía visible durante varios segundos, incluso cuando la base de datos todavía no contenía información.
Necesitaba determinar si el problema estaba relacionado con la implementación del hook, la conexión con Firebase o algún aspecto de la configuración del proyecto.

**Prompt**
La aplicación demora demasiado tiempo mostrando el estado "Cargando tareas...", incluso cuando la base de datos está vacía.
Quiero analizar todas las posibles causas antes de modificar el código.
Ayudame a revisar el flujo completo de carga, incluyendo el hook useTasks, la conexión con Firebase, la configuración de Firestore y cualquier otro factor que pueda estar provocando este comportamiento.

**Qué decidí**
En lugar de asumir la primera explicación, fuimos descartando distintas hipótesis de manera progresiva.
Revisé el funcionamiento del hook useTasks, el comportamiento de la aplicación en distintos navegadores, el estado de la conexión y la configuración del proyecto hasta identificar la causa real: la base de datos de Cloud Firestore todavía no había sido creada para ese proyecto.
Antes de aplicar cualquier cambio confirmé que ese era efectivamente el origen del problema y luego verifiqué que, una vez creada la base de datos, el tiempo de carga volvía a ser el esperado.

## Comprensión de la arquitectura para integrar AWS SES de forma segura
**Contexto**
Para implementar el envío de correos mediante AWS SES, surgió la duda sobre si era posible realizar la llamada directamente desde el frontend o si era necesario incorporar una capa intermedia.
Antes de implementar la solución, quise comprender el motivo técnico detrás de esa decisión.

**Prompt**
Estoy integrando AWS SES en una aplicación desarrollada con React.
¿Por qué no es recomendable realizar la llamada directamente desde el navegador?
Necesito comprender los riesgos de seguridad asociados a esa implementación y cuál es la arquitectura recomendada para proteger las credenciales de AWS sin afectar el funcionamiento de la aplicación.

**Qué decidí**
Antes de implementar la solución entendí que realizar llamadas directas desde el navegador implicaría exponer las credenciales de AWS dentro del bundle del cliente, permitiendo que cualquier usuario pudiera inspeccionarlas y utilizarlas de forma indebida.
Con ese concepto claro decidí implementar un patrón Backend for Frontend (BFF) utilizando una función serverless en Vercel como intermediaria entre la aplicación y AWS SES, manteniendo las credenciales protegidas del lado del servidor.
La decisión no consistió únicamente en aplicar una solución propuesta por la IA, sino en comprender primero el motivo de esa arquitectura y luego implementarla.

## Validación de las reglas de seguridad de Cloud Firestore
**Contexto**
Las reglas de seguridad de Cloud Firestore fueron diseñadas e implementadas por mí utilizando funciones auxiliares como isSignedIn, isOwnerExisting, isOwnerIncoming y hasValidShape.
Antes de publicar la aplicación necesitaba verificar que dichas reglas protegieran correctamente el acceso a los datos de cada usuario.

**Prompt**
Implementé las reglas de seguridad de Cloud Firestore para controlar el acceso a los documentos.
Necesito revisar si la lógica definida es correcta, identificar posibles casos que no haya contemplado y confirmar que las reglas respetan el aislamiento de datos entre usuarios autenticados.
Quiero revisar las reglas existentes, no generar una nueva implementación desde cero.

**Qué decidí**
Utilicé la IA para revisar una implementación que ya había desarrollado previamente, con el objetivo de validar su lógica y detectar posibles mejoras.
Después de esa revisión realicé pruebas manuales utilizando distintos usuarios autenticados para comprobar que cada uno únicamente pudiera acceder a su propia información.
Solo después de verificar el correcto aislamiento de datos consideré finalizada la configuración de seguridad.


## Reflexión sobre el uso de IA durante el proyecto

Durante el desarrollo utilicé la IA principalmente como una herramienta de apoyo para:
 - Comprender errores de compilación y configuración;
 - Analizar distintas alternativas de implementación;
 - Validar decisiones técnicas;
 - Resolver bugs puntuales después de haber identificado el problema.

En todos los casos procuré comprender las soluciones propuestas antes de incorporarlas al proyecto. Cuando una respuesta no respetaba la arquitectura existente, las convenciones del código o el comportamiento esperado, preferí investigar más, volver a las clases o descartarla y solicitar una alternativa antes que aceptarla sin analizarla.

También utilicé la IA para contrastar diferentes enfoques de implementación y comprender las ventajas y desventajas de cada uno antes de tomar una decisión.

Este proceso me permitió utilizar la IA como una herramienta para acelerar el desarrollo y reforzar el aprendizaje, manteniendo siempre el criterio propio durante la implementación y la validación de cada cambio.