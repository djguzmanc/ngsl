#  @ngsl/schematics (BETA)

An useful library for scaffold an Angular 9 project with the Slabcode enterprise architecture using Angular Schematics

## Installation

Run ```npm install @ngsl/schematics --save-dev```

To use ```@ngsl/schematics``` as the default collection in your Angular CLI project, add it to your angular.json or type on your command line: 

```ng config cli.defaultCollection @ngsl/schematics```

## Usage
Once the ```ng new``` command has been executed you can run:

### Project: 
- Command ```ng g @ngsl/schematics:project``` **alias: _p_**
- Creates the basic project structures, such as files, folders, etc
- Be careful running this command, it will replace all the files and some work might be erased

### View Module: 
- Command ```ng g @ngsl/schematics:view-module <name>``` **alias: _vm_**
- Creates a view module with custom routes and a _pages_ folder

#### Optional params
|NAME              |TYPE            |DEFAULT|DESCRIPTION|
|------------------|----------------|-------|-----------|
|wrapper           |`boolean`       |`true` |By default the schematic will create a wrapper, i.e. a component that will wrap the children components declared within|

### Shareable Module: 
- Command ```ng g @ngsl/schematics:shareable-module <name>``` **alias: _sm_**
- Creates a shareable module, i. e.modules like Ui, meaning that it's components will be declared and exported

### Interfaces/Enums
- Command ```ng g @ngsl/schematics:(ngsl-interface|ngsl-enum) <name>``` **alias: _ngsl-i_/_ngsl-e_**
- Creates an interface

#### Optional params
|NAME              |TYPE            |DEFAULT     |DESCRIPTION|
|------------------|----------------|------------|-----------|
|group             |`string`        |`auxiliary` |Creates an interface inside a grouped folder with the given name, if not provided the file will be created inside an _auxiliary_ folder|

### Domain Enum
- Command ```ng g @ngsl/schematics:(domain-enum) <name>``` **alias: _denum_**
- Creates a domain enum

### Component
- Command ```ng g @ngsl/schematics:ngsl-component <name>``` **alias: _ngsl-c_**
- Creates a component and place it inside the _index.ts_ file which contains all the module declarations

### Page
- Command ```ng g @ngsl/schematics:page <name>``` **alias: _pg_**
- Creates a page and place it inside the _index.ts_ file which contains all the module declarations

### Controller
- Command ```ng g @ngsl/schematics:controller <name>``` **alias: _ct_**
- Creates and API service and a Facade for the given entity name

### Facade
- Command ```ng g @ngsl/schematics:facade <name>``` **alias: _f_**
- Creates a Facade for the given name

### Class
- Command ```ng g @ngsl/schematics:ngsl-class <name>``` **alias: _ngsl-cl_**
- Creates a class and place it inside the _index.ts_

### Model
- Command ```ng g @ngsl/schematics:model <name>``` **alias: _m_**
- Creates a model and imports it inside the _index.ts_

#### Optional params
|NAME              |TYPE            |DEFAULT     |DESCRIPTION|
|------------------|----------------|------------|-----------|
|useInterface      |`boolean`       |`false`     |Will add an interface with the given name|
|singleInterface   |`boolean`       |`false`     |Will not generate a class but a single interface|

### Observable service
- Command ```ng g @ngsl/schematics:observable-service <name>``` **alias: _os_**
- Creates an observable service and imports it inside the _index.ts_