#DAZZLE

#### Why

I believe that most real time cross platform animation/interactivity engines are too complicated these days, meaning we
are actually seeing less output from relatively non technical creatives than we should be. This is an attempt to make
something very lightweight, but also allow publishing too all platforms (web + ios/android native) in real time (quickly
being able to know if your project is working is an essential feedback mechanism for the creative process)

Think Flash for today (once the tooling is built around the engine)

Think your own instagram stories engine.

### hello world

- npm i razzle-dazzle -g
- dazzle startproject <project_name>
- cd <project_name>
- dazzle runserver

open localhost:4242

### A quick word on trees

TBA

##### A quick word on Views

A view is a rectangular area of a computer UI, that can be joined to each other through a parent<-->child relationship. Almost
every piece of software is organised using hierarchical rectangular blocks. So almost every other UI type has a base type of view.


#### What?

In the new project folder you will have created, you will find 2 things: A component folder & index.json file

##### Entities

In the index.json file, you will find a hierarchical definition of the initial scene of your project. This simply describes
that we will be using the flikHtmlRenderer as our base renderer (this could be a three.js canvas, HTML5 Canvas, a native mobile
renderer, or something else)

Then as a child of that, we add a square view, style it, and add helloworld! text.

In order to manage the difference between places in the hierarchy, we use Entities (BaseRenderer, View) which are abstract nodes
on the tree/hierarchy. On their own, entities don't do anything. You can then attach any number of components to entities, to make
them do things. Our entities just use flikHtmlRenderer and view. flikHtmlRenderer comes from the engine core, but view comes
from right inside this project, so you could modify and change it however you see fit. Also it is accompanied by a baseComponent,
which gives all components in your project some shared behaviours.

##### Components

As with many systems these days, a "component" model is used. A component is potential collection of code/logic/styling/anything.
Components are attached to Entities, which then let the components come to life, at the specific position in the scene.