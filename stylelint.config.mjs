// oxlint-disable import/no-anonymous-default-export

/** @type {import("stylelint").Config} */
export default {
    extends: ['stylelint-config-standard'],

    overrides: [
        {
            extends: ['stylelint-config-recommended-vue'],
            files: ['**/*.vue'],
        },
    ],

    plugins: [
        'stylelint-plugin-defensive-css',
        'stylelint-plugin-logical-css',
        'stylelint-use-nesting',
    ],

    reportDescriptionlessDisables: true,
    reportInvalidScopeDisables: true,
    reportNeedlessDisables: true,

    rules: {
        'csstools/use-nesting': true,
        'declaration-no-important': true,
        'defensive-css/no-list-style-none': true,
        'defensive-css/no-mixed-vendor-prefixes': true,
        'defensive-css/no-unsafe-will-change': true,
        'defensive-css/require-background-repeat': true,
        'defensive-css/require-custom-property-fallback': true,
        'defensive-css/require-dynamic-viewport-height': true,
        'defensive-css/require-flex-wrap': true,
        'defensive-css/require-focus-visible': true,
        'defensive-css/require-overscroll-behavior': true,
        'defensive-css/require-prefers-reduced-motion': true,
        'defensive-css/require-scrollbar-gutter': true,
        'function-url-no-scheme-relative': true,
        'logical-css/require-logical-keywords': true,
        'logical-css/require-logical-properties': [
            true,
            { fix: true, severity: 'warning' },
        ],
        'logical-css/require-logical-units': null,
        'no-descending-specificity': null,
        'no-unknown-animations': true,
        'no-unknown-custom-media': true,
        'no-unknown-custom-properties': true,
    },
};
