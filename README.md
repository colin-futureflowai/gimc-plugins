# GIMC-plugins voor Claude

Marketplace met de officiële GIMC-plugin: content-skills die hun resultaat op het GIMC-canvas zetten, plus de
GIMC-connector (MCP).

## Installeren

In Claude Code:

```
/plugin marketplace add colin-futureflowai/gimc-plugins
/plugin install gimc@gimc
```

Daarna vraagt Claude bij het eerste gebruik om in te loggen bij GIMC. Updates komen automatisch binnen zodra er een
nieuwe versie in deze repo staat.

## Nieuwe versie uitbrengen (beheer)

1. Verhoog `version` in `gimc-app/plugin/brand.json` en merge dat naar `main`.
2. Draai `./update.sh` in deze map (bouwt uit `../gimc-app`), controleer het verschil, commit en push.

Deze repo bevat alleen de gebouwde plugin; de bron staat in `gimc-app/plugin/`.
