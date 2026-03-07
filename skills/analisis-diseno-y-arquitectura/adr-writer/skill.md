# ADR Writer

Genera un Architecture Decision Record (ADR) a partir de una decisión técnica descrita por el usuario.

## Comportamiento

A partir del contexto y la decisión indicada, produce un ADR completo en formato Markdown listo para incluir en el repositorio.

## Formato de salida

```markdown
# ADR-XXXX: [Título de la decisión]

**Fecha:** YYYY-MM-DD
**Estado:** Propuesto | Aceptado | Deprecado | Reemplazado por ADR-XXXX

## Contexto

[Situación que obliga a tomar esta decisión. Restricciones, fuerzas en juego, problema a resolver.]

## Decisión

[La decisión tomada, formulada de forma clara y directa.]

## Alternativas consideradas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| ...         | ...  | ...     |

## Consecuencias

**Positivas:**
- ...

**Negativas / Trade-offs:**
- ...

## Referencias

- [Links relevantes, tickets, PR, documentación]
```

## Instrucciones adicionales

- Si el usuario no especifica alternativas, propón al menos dos razonables.
- Si la decisión tiene implicaciones de seguridad o rendimiento, añade una sección "Riesgos".
- El tono debe ser neutro y técnico, sin justificar la decisión más allá de los hechos.
