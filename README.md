# Tap and Scrape Band

A little browser toy where a row of tapping and scraping instruments play a rhythm together. I'm building it one step at a time.

Right now (step 4) you can edit the beat. Under every instrument is a grid of 16 dots: a coloured dot is a step where it plays, a dark dot is silent. Tap a dot to switch it on or off. A white ring and glow move along the grid to show which step the band is on.

To play, tap any dot or instrument. The first tap wakes the band and it loops forever, so you can change the groove while it plays. The sounds come from the Web Audio API: a woodblock tock, claves clack, a guiro scrape, a triangle ting and a shaker shh.

Next I'll add a tempo slider and a start button.
