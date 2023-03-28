# lovelace-countdown-card
I needed a really simple card to countdown to a specific date and time on my dashboard and couldn't really find anything that did it. The code is purely used for my own usecase and it may or may not work for you. There's also no visual editor for now.

This card does the following:
- Takes one or more date and time input helpers
- Calculates the amount of hours, minutes and seconds till the given date
- Counts down in real-time

There's also a way to show a banner above it.

# Installation
I haven't gotten around to releasing this for HACS yet so for now just drop the `countdown-card.js` in the config/www directory and add it as resource.
This is through `Dashboard -> Edit Dashboard -> Three dots top right -> Manage resources` and set the URL to `/local/countdown-card.js`

# Example usage
```
type: custom:countdown-card
image: https://url-to-your-image
indicators:
  - hours: 24
    color: '#37FF00'
  - hours: 4
    color: '#FF0000'
entities:
  - entity: input_datetime.my_birthday
  - entity: input_datetime.christmas
```

## image (optional)
Banner image that is displayed above the block.

## indicators (optional)
Accepts one or more indicators. Basically the color of the countdown changes to the given hex once hours go below the given.

## entities
The datetime entities.
