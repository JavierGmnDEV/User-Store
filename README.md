# 08-user-store — Pasos mentales

Guía corta: qué pensar al construir (o leer) cada pieza, y **por qué**.

---

## 1. Separar capas antes de escribir código

**Paso mental:** ¿Esto es HTTP, negocio o base de datos?

| Pregunta | Capa |
|----------|------|
| ¿Lee `req` / escribe `res`? | Presentation |
| ¿Es regla de negocio o forma del dato? | Domain |
| ¿Habla con Mongo/Mongoose? | Data |
| ¿Es config global (env, regex)? | Config |

**Por qué:** si mezclas todo, un cambio de BD o de Express rompe media app. Cada capa tiene un solo motivo para cambiar.

---

## 2. Arrancar de afuera hacia adentro

**Orden mental:**

1. `app.ts` → conectar BD + levantar server  
2. `Server` → middlewares y rutas  
3. `AppRoutes` → montar `/api/...`  
4. Feature (`auth/routes` → controller → service)  
5. Domain (DTO, entity, errors) cuando haga falta validar o modelar  
6. Data (modelo) solo cuando persistas  

**Por qué:** primero tienes el “tubo” HTTP funcionando; después enchufas reglas y persistencia. Evitas inventar modelos sin saber quién los va a usar.

---

## 3. Validar entrada ANTES de tocar la BD

**Paso mental:** body → DTO → ¿ok? → servicio → BD

- DTO (`CreateUserDTO`): “¿el request tiene forma válida?”  
- Servicio: “¿la regla de negocio lo permite?” (ej. email ya existe)  
- Modelo: “¿Mongo puede guardarlo?”  

**Por qué:** fallar barato. Un `missing Name` no debería costar una query. La BD no es tu validador principal.

---

## 4. Errores: crearlos en dominio, responderlos en presentation

**Paso mental:**

- En service/entity → `throw CustomError.BadRequest(...)`  
- En controller → `res.status(err.statusCode).json({ message })`  

**Por qué:** el dominio sabe *qué* falló; Express sabe *cómo* decírselo al cliente. Si en el `.catch` solo creas un `CustomError` y no llamas a `res`, la petición se queda colgada.

---

## 5. Modelo ≠ entidad

**Paso mental:**

- `UserMoldel` (data) = cómo se **guarda** en Mongo  
- `UserEntity` (domain) = cómo lo entiende el **negocio**  

**Por qué:** mañana puedes cambiar Mongo y el negocio sigue hablando el mismo idioma. No amarras la app al schema.

---

## 6. El controller no piensa; orquesta

**Paso mental del controller:**

1. Validar DTO  
2. Llamar servicio  
3. Mapear éxito → JSON  
4. Mapear error → status + mensaje  

**Por qué:** si metes `findOne` / `save` en el controller, no puedes reutilizar esa lógica (otro endpoint, CLI, test) sin HTTP.

---

## 7. Inyectar dependencias en las rutas del feature

**Paso mental:** `routes.ts` de auth crea `AuthService` y se lo pasa al `AuthController`.

**Por qué:** el controller no instancia sus dependencias; es más fácil testear y cambiar implementaciones.

---

## 8. Flujo mental del register (checklist)

```
¿Body válido?     → DTO          → 400 si no
¿Usuario existe?  → Service      → CustomError 400
¿Se puede guardar?→ Model/save   → CustomError
¿Respuesta?       → Controller   → JSON o status del error
```

Si algo “da vueltas” en el cliente: casi seguro **falta responder en el catch**.

---

## Mapa rápido de archivos

| Archivo | Pregunta que responde |
|---------|----------------------|
| `app.ts` | ¿Cómo arranca todo? |
| `envs.ts` | ¿Qué config necesito? |
| `server.ts` | ¿Cómo escucha HTTP? |
| `routes.ts` | ¿Qué módulos cuelgan de `/api`? |
| `auth/routes.ts` | ¿Qué endpoints tiene auth y quién los atiende? |
| `controller.ts` | ¿Cómo se traduce HTTP ↔ caso de uso? |
| `Auth.Service.ts` | ¿Cuál es la lógica del registro? |
| `Create.User.DTO.ts` | ¿El body es aceptable? |
| `custom.errors.ts` | ¿Qué tipo de fallo de negocio es? |
| `User.entity.ts` | ¿Qué es un usuario para el dominio? |
| `Users.model.ts` | ¿Cómo se persiste un usuario? |
| `mongo/init.ts` | ¿Cómo me conecto a la BD? |

---

## Frase para recordar

> **Request → validar → decidir (negocio) → persistir → responder.**  
> Cada flecha es una capa; no saltes ni mezcles responsabilidades.
