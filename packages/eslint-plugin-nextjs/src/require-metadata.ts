import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import { getPropertyName, isFunction } from '@typescript-eslint/utils/dist/ast-utils';

function isNamedExport(node: TSESTree.ProgramStatement): node is TSESTree.ExportNamedDeclaration {
  return node.type === TSESTree.AST_NODE_TYPES.ExportNamedDeclaration;
}
function isVariableDeclaration(node: TSESTree.NamedExportDeclarations | null): node is TSESTree.VariableDeclaration {
  return node !== null && node.type === TSESTree.AST_NODE_TYPES.VariableDeclaration;
}
function isIdentifer(node: TSESTree.Node): node is TSESTree.Identifier {
  return node.type === TSESTree.AST_NODE_TYPES.Identifier;
}
function isObjectExpression(node: TSESTree.Expression | null): node is TSESTree.ObjectExpression {
  return node !== null && node.type === TSESTree.AST_NODE_TYPES.ObjectExpression;
}
function isProperty(node: TSESTree.ObjectLiteralElement): node is TSESTree.Property {
  return node.type === TSESTree.AST_NODE_TYPES.Property;
}

export const requireMetadata = ESLintUtils.RuleCreator.withoutDocs({
  create(context) {
    return {
      Program(program) {

        const hasMetadataExport = program.body
          .filter(isNamedExport)
          .some((e) => {
            if(isVariableDeclaration(e.declaration) && e.declaration.kind === 'const') {
              const variableDeclaration = e.declaration.declarations[0];

              if(isIdentifer(variableDeclaration.id) && variableDeclaration.id.name === 'metadata') {
                const object = variableDeclaration.init;

                if(isObjectExpression(object)) {
                  // const hasTitle = object.properties.filter(isProperty).some(({ key }) => isIdentifer(key) && key.name === 'title')
                  const hasTitle = object.properties.filter(isProperty).some((node) => getPropertyName(node) ===  'title')

                  if(!hasTitle) {
                    context.report({
                      messageId: 'require-metadata-title',
                      node: object,
                      suggest: [
                        {
                          messageId: 'require-metadata-title-fix',
                          fix: (fixer) => fixer.insertTextBefore(object.properties[0], `title: '',\n${' '.repeat(object.properties[0].loc.start.column)}`)
                        }
                      ]
                    });
                  }
                }

                return true;
              }
            } else if (isFunction(e.declaration)) {
              if(e.declaration.id?.name === 'generateMetadata') {
                return true;
              }
            }

            return false;
          })

        if(!hasMetadataExport) {
          context.report({
            messageId: 'require-metadata',
            node: program,
            // loc: { line: 0, column: 0 }
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description: 'Pages should define metadata with title',
      recommended: 'warn'
    },
    messages: {
      'require-metadata': 'Define and export `metadata` or `generateMetadata`',
      'require-metadata-title': 'Add title to metadata',
      'require-metadata-title-fix': 'Add title to metadata',
    },
    type: 'suggestion',
    schema: [],
    hasSuggestions: true
  },
  defaultOptions: [],
});
