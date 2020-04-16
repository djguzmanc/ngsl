#  NGSL Library (BETA)

An useful library for scaffold an Angular 9 project with the Slabcode enterprise architecture using Angular Schematics

## Installation
Run ```npm install @ngsl/schematics```

## Use
Once the ```ng new``` command has been executed you can run:

### Project: 
- Command ```ng g @ngsl/schematics:project```, alias: _p_
- Creates the basic project structures, such as files, folders, etc
- Be careful running this command, it will replace all the files and some work might be erased

### View Module: 
- Command ```ng g @ngsl/schematics:view-module <name: string> --wrapper=<wrapper?: boolean>```, alias: _vm_
- Creates a view module with custom routes and a _pages_ folder
- By default the schematic will create a wrapper, i.e. a component that will wrap the children components declared within

### Shareable Module: 
- Command ```ng g @ngsl/schematics:shareable-module <name: string>```, alias: _sm_
- Creates a shareable module, i. e.modules like Ui, meaning that it's components will be declared and exported

### Interfaces/Enums
- Command ```ng g @ngsl/schematics:(interface|enum) <name: string> --group=<group?: string>```, alias: _i_/_e_
- Creates an interface or enum that can be grouped into separated folders specifying the group name (optional), if not the file will be created inside an _auxiliary_ folder

### Component
- Command ```ng g @ngsl/schematics:component <name: string>```, alias: _c_
- Creates a component and place it inside the _index.ts_ file which contains all the module declarations

### Page
- Command ```ng g @ngsl/schematics:page <name: string>```, alias: _pg_
- Creates a page and place it inside the _index.ts_ file which contains all the module declarations

### Controller
- Command ```ng g @ngsl/schematics:controller <name: string>```, alias: _ct_
- Creates and API service and a Facade for the given entity name

### Class
- Command ```ng g @ngsl/schematics:class <name: string>```, alias: _cl_
- Creates a class and place it inside the _index.ts_

### Model
- Command ```ng g @ngsl/schematics:model <name: string>```, alias: _m_
- Creates a model and imports it inside the _index.ts_

### Observable service
- Command ```ng g @ngsl/schematics:observable-service <name: string>```, alias: _os_
- Creates an observable service and imports it inside the _index.ts_