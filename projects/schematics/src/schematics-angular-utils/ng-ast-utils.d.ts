import { Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { AppConfig } from './config';
export declare function findBootstrapModuleCall(host: Tree, mainPath: string): ts.CallExpression | null;
export declare function findBootstrapModulePath(host: Tree, mainPath: string): string;
export declare function getAppModulePath(host: Tree, app: AppConfig): import("@angular-devkit/core").Path;
