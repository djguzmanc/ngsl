import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { AddToModuleContext } from './add-to-module-context';
import * as ts from 'typescript';
import { strings } from '@angular-devkit/core';
import { ModuleOptions, buildRelativePath } from '../schematics-angular-utils/find-module';
import { addDeclarationToModule, addExportToModule } from '../schematics-angular-utils/ast-utils';
import { InsertChange } from '../schematics-angular-utils/change';

export function addDeclarationToNgModule(options: ModuleOptions, exports: boolean): Rule {
  return (host: Tree) => {
    addDeclaration(host, options);
    if (exports) {
      addExport(host, options);
    }
    return host;
  };
}

function createAddToModuleContext(host: Tree, options: ModuleOptions): AddToModuleContext {

  const result = new AddToModuleContext();

  if (!options.module) {
    throw new SchematicsException(`Module not found.`);
  }

  const text = host.read(options.module);

  if (text === null) {
    throw new SchematicsException(`File ${options.module} does not exist.`);
  }
  const sourceText = text.toString('utf-8');
  result.source = ts.createSourceFile(options.module, sourceText, ts.ScriptTarget.Latest, true);

  const componentPath = `/${options.sourceDir}/${options.path}/`
    + strings.dasherize(options.name) + '/'
    + strings.dasherize(options.name)
    + '.component';

  result.relativePath = buildRelativePath(options.module, componentPath);

  result.classifiedName = strings.classify(`${options.name}Component`);

  return result;

}

function addDeclaration(host: Tree, options: ModuleOptions) {

  const context = createAddToModuleContext(host, options);
  const modulePath = options.module || '';

  const declarationChanges = addDeclarationToModule(context.source,
    modulePath,
    context.classifiedName,
    context.relativePath);

  const declarationRecorder = host.beginUpdate(modulePath);
  for (const change of declarationChanges) {
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(declarationRecorder);
};

function addExport(host: Tree, options: ModuleOptions) {
  const context = createAddToModuleContext(host, options);
  const modulePath = options.module || '';
  

  const exportChanges = addExportToModule(context.source,
    modulePath,
    context.classifiedName,
    context.relativePath);

  const exportRecorder = host.beginUpdate(modulePath);

  for (const change of exportChanges) {
    if (change instanceof InsertChange) {
      exportRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(exportRecorder);
};