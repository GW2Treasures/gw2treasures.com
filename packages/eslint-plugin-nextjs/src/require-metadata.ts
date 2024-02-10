import { ESLintUtils, TSESTree, ASTUtils } from '@typescript-eslint/utils';

function isExported(node: TSESTree.Node | undefined) {
  return node !== undefined && node.parent?.type === TSESTree.AST_NODE_TYPES.ExportNamedDeclaration;
}

export const requireMetadata = ESLintUtils.RuleCreator.withoutDocs({
  create(context) {
    let metadataDeclarator: TSESTree.VariableDeclarator;
    let hasMetadataTitle = false;

    let hasMetadataExport = false;
    let hasGenerateMetadataExport = false;

    return {
      Property(property) {
        if(ASTUtils.getPropertyName(property) === 'title' && metadataDeclarator && property.parent === metadataDeclarator.init) {
          hasMetadataTitle = true;
        }
      },

      VariableDeclarator(node) {
        if(isExported(node.parent) && node.id.type === TSESTree.AST_NODE_TYPES.Identifier && node.id.name === 'metadata') {
          metadataDeclarator = node;
          hasMetadataExport = true;
        }
      },

      'VariableDeclarator:exit'(node: TSESTree.VariableDeclarator) {
        if(node === metadataDeclarator && !hasMetadataTitle) {
          context.report({
            node: node.init ?? node,
            messageId: 'require-metadata-title',
          });
        }
      },

      FunctionDeclaration(node) {
        if(isExported(node) && node.id?.name === 'generateMetadata') {
          hasGenerateMetadataExport = true;
        }
      },

      ExportSpecifier(node) {
        if(isExported(node) && node.exported.name === 'metadata') {
          hasMetadataExport = true;
        }
      },

      'Program:exit'(program: TSESTree.Program) {
        if(!hasMetadataExport && !hasGenerateMetadataExport) {
          context.report({
            messageId: 'require-metadata',
            loc: program.loc.end
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description: 'Pages should define metadata with title',
      recommended: 'recommended'
    },
    messages: {
      'require-metadata': 'Export `metadata` or `generateMetadata`',
      'require-metadata-title': 'Add title to metadata',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
});
