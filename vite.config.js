import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const pages = {"planejamento":{"outputDir":"./planejamento","lang":"pt","cacheVersion":83,"meta":[{"name":"twitter:card","content":"summary"},{"property":"og:type","content":"website"},{"name":"robots","content":"noindex, nofollow"}],"scripts":{"head":"<link rel=\"stylesheet\" href=\"files/wewebGlobaslCSS.css?_wwcv=83\" />\r\n<link rel=\"stylesheet\" href=\"files/dataGrid.css?_wwcv=83\" />\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://app.unimble.com.br/planejamento/"},{"rel":"alternate","hreflang":"pt","href":"https://app.unimble.com.br/planejamento/"}]},"retaguarda":{"outputDir":"./retaguarda","lang":"pt","cacheVersion":83,"meta":[{"name":"twitter:card","content":"summary"},{"property":"og:type","content":"website"},{"name":"robots","content":"noindex, nofollow"}],"scripts":{"head":"<link rel=\"stylesheet\" href=\"files/wewebGlobaslCSS.css?_wwcv=83\" />\r\n<link rel=\"stylesheet\" href=\"files/dataGrid.css?_wwcv=83\" />\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://app.unimble.com.br/retaguarda/"},{"rel":"alternate","hreflang":"pt","href":"https://app.unimble.com.br/retaguarda/"}]},"inicio":{"outputDir":"./inicio","lang":"pt","cacheVersion":83,"meta":[{"name":"twitter:card","content":"summary"},{"property":"og:type","content":"website"},{"name":"robots","content":"noindex, nofollow"}],"scripts":{"head":"<link rel=\"stylesheet\" href=\"files/wewebGlobaslCSS.css?_wwcv=83\" />\r\n<link rel=\"stylesheet\" href=\"files/dataGrid.css?_wwcv=83\" />\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://app.unimble.com.br/inicio/"},{"rel":"alternate","hreflang":"pt","href":"https://app.unimble.com.br/inicio/"}]},"recuperar/:param":{"outputDir":"./recuperar/:param","lang":"pt","cacheVersion":83,"meta":[{"name":"twitter:card","content":"summary"},{"property":"og:type","content":"website"},{"name":"robots","content":"index, follow"}],"scripts":{"head":"<link rel=\"stylesheet\" href=\"files/wewebGlobaslCSS.css?_wwcv=83\" />\r\n<link rel=\"stylesheet\" href=\"files/dataGrid.css?_wwcv=83\" />\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://app.unimble.com.br/recuperar/:param/"},{"rel":"alternate","hreflang":"pt","href":"https://app.unimble.com.br/recuperar/:param/"}]},"index":{"outputDir":"./","lang":"pt","cacheVersion":83,"meta":[{"name":"twitter:card","content":"summary"},{"property":"og:type","content":"website"},{"name":"robots","content":"index, follow"}],"scripts":{"head":"<link rel=\"stylesheet\" href=\"files/wewebGlobaslCSS.css?_wwcv=83\" />\r\n<link rel=\"stylesheet\" href=\"files/dataGrid.css?_wwcv=83\" />\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://app.unimble.com.br/"},{"rel":"alternate","hreflang":"pt","href":"https://app.unimble.com.br/"}]}};

// Read the main HTML template
const template = fs.readFileSync(path.resolve(__dirname, 'template.html'), 'utf-8');
const compiledTemplate = handlebars.compile(template);

// Generate an HTML file for each page with its metadata
Object.values(pages).forEach(pageConfig => {
    // Compile the template with page metadata
    const html = compiledTemplate({
        title: pageConfig.title,
        lang: pageConfig.lang,
        meta: pageConfig.meta,
        scripts: {
            head: pageConfig.scripts.head,
            body: pageConfig.scripts.body,
        },
        alternateLinks: pageConfig.alternateLinks,
        cacheVersion: pageConfig.cacheVersion,
        baseTag: pageConfig.baseTag,
    });

    // Save output html for each page
    if (!fs.existsSync(pageConfig.outputDir)) {
        fs.mkdirSync(pageConfig.outputDir, { recursive: true });
    }
    fs.writeFileSync(`${pageConfig.outputDir}/index.html`, html);
});

const rollupOptionsInput = {};
for (const pageName in pages) {
    rollupOptionsInput[pageName] = path.resolve(__dirname, pages[pageName].outputDir, 'index.html');
}

export default defineConfig(() => {
    return {
        plugins: [nodePolyfills({ include: ['events', 'stream', 'string_decoder'] }), vue()],
        base: "/",
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                },
            },
            postcss: {
                plugins: [autoprefixer],
            },
        },
        build: {
            chunkSizeWarningLimit: 10000,
            rollupOptions: {
                input: rollupOptionsInput,
                onwarn: (entry, next) => {
                    if (entry.loc?.file && /js$/.test(entry.loc.file) && /Use of eval in/.test(entry.message)) return;
                    return next(entry);
                },
                maxParallelFileOps: 900,
            },
        },
        logLevel: 'warn',
    };
});
