import { createRouter, createWebHistory } from 'vue-router';

import wwPage from './views/wwPage.vue';

import { initializeData, initializePlugins, onPageUnload } from '@/_common/helpers/data';

let router;
const routes = [];

function scrollBehavior(to) {
    if (to.hash) {
        return {
            el: to.hash,
            behavior: 'smooth',
        };
    } else {
        return { top: 0 };
    }
}

 
/* wwFront:start */
import pluginsSettings from '../../plugins-settings.json';

// eslint-disable-next-line no-undef
window.wwg_designInfo = {"id":"bb4fc774-c48b-4e22-bbc8-647406422ec0","homePageId":"dda383e4-9de6-43c9-92a9-68e3e1980b67","authPluginId":"1fa0dd68-5069-436c-9a7d-3b54c340f1fa","baseTag":{},"defaultTheme":"dark","langs":[{"lang":"en","default":false,"isDefaultPath":false},{"lang":"pt","default":true,"isDefaultPath":false}],"background":{},"workflows":[{"id":"8c5d996d-70e5-4fba-b5ad-e9d12262934e","name":"Display or Hide Sidebar depending on the breakpoint","actions":{"18446934-06df-4df1-8066-33800bd13cd4":{"id":"18446934-06df-4df1-8066-33800bd13cd4","name":"Display Sidebar","type":"execute-workflow","parameters":{"display":true},"workflowId":"e30697b6-98a8-4fc4-aca9-ec00fd787942"},"6696f480-a5e2-4dd5-b001-e11e2ba3f1d3":{"id":"6696f480-a5e2-4dd5-b001-e11e2ba3f1d3","name":"Display Sidebar","type":"execute-workflow","parameters":{"display":true},"workflowId":"e30697b6-98a8-4fc4-aca9-ec00fd787942"},"703bdf64-15c6-4027-b539-a033cceef13e":{"id":"703bdf64-15c6-4027-b539-a033cceef13e","type":"switch","value":{"code":"globalContext.browser['breakpoint']","__wwtype":"f"},"branches":[{"id":"6696f480-a5e2-4dd5-b001-e11e2ba3f1d3","value":"default"},{"id":"18446934-06df-4df1-8066-33800bd13cd4","value":"tablet"},{"id":"ed5e49f7-7cd2-4877-987f-db7d858811eb","value":"mobile"}]},"ed5e49f7-7cd2-4877-987f-db7d858811eb":{"id":"ed5e49f7-7cd2-4877-987f-db7d858811eb","name":"Hide Sidebar","type":"execute-workflow","parameters":{"display":false},"workflowId":"e30697b6-98a8-4fc4-aca9-ec00fd787942"}},"trigger":"before-collection-fetch","firstAction":"703bdf64-15c6-4027-b539-a033cceef13e"}],"pages":[{"id":"8744f9d1-3270-474b-85bd-8851a98d6b2a","linkId":"8744f9d1-3270-474b-85bd-8851a98d6b2a","name":"Planejamento","folder":null,"paths":{"en":"planejamento","pt":"planejamento","default":"planejamento"},"langs":["pt"],"cmsDataSetPath":null,"sections":[{"uid":"80122218-17a2-4505-a762-e600aef0f6fb","sectionTitle":"MainContainer","linkId":"a399bc31-9f6b-49a2-900b-3276b2925297"},{"uid":"cd515cd4-b014-4997-9ce0-0194dbda6de7","sectionTitle":"addForça","linkId":"e1695997-8655-4fc2-85fd-d85f4a576e09"},{"uid":"520d2df8-610d-4107-ba69-7f0e264f02e4","sectionTitle":"addOportunidade","linkId":"06f9d8d6-50fa-46f3-b0b0-9ab0fbd833a0"},{"uid":"5a51bfd1-2dfe-4aef-a825-7713b9267fe9","sectionTitle":"addConquista","linkId":"e96d8f95-7913-4854-b80e-30c4a0e0d194"},{"uid":"8db19e79-09d0-4a4e-9ccd-57fd20ab39e9","sectionTitle":"addObjetivo","linkId":"a11b1551-03b2-47e6-9ac0-f760db075fbc"},{"uid":"3ce93956-a8d9-4079-b975-f056ee2fb1ee","sectionTitle":"addMeta","linkId":"7c2ccf86-0239-4f04-8eeb-7e42a1006ffb"},{"uid":"04185a3d-fe5c-45b4-a22e-bff3330d7a4f","sectionTitle":"configForça","linkId":"1e60daec-134f-49b8-9fde-8332d356cc28"},{"uid":"3fbd1f5f-55ab-40ad-a3b7-5089a76470d8","sectionTitle":"configOportunidades","linkId":"6af1a759-b3e7-4a00-ac0e-112f08ddd83e"},{"uid":"fad6bc98-0448-490c-a51d-1e3699786c7c","sectionTitle":"configConquistas","linkId":"021b4dfe-3640-4889-b5b6-8c42eb688b56"},{"uid":"2e0cb96b-6505-4e04-8f71-438dfdc6c94f","sectionTitle":"configObjetivo","linkId":"d8399bf6-361a-45b3-a0ab-1faedccb2c4e"},{"uid":"e4dab264-0a07-493b-a4db-595e69d4ad89","sectionTitle":"configMeta","linkId":"3077d5d4-0cf8-4572-85a6-b7abbcd9cc80"},{"uid":"a309f2a5-689c-415f-a9bd-6b46279180e4","sectionTitle":"deleteConfirm","linkId":"a961ed55-93eb-4c00-9a50-5fd23f12f766"},{"uid":"d2854075-8d2d-4ac6-9aad-dfeac62ed1d9","sectionTitle":"Alert (Depreciado)","linkId":"c248e981-729a-4eb7-9d0f-2a46d10c6e31"}],"pageUserGroups":[{}],"title":{"en":"Unimble app"},"meta":{"desc":{"en":"Eleve a Gestão do seu Negócio e Alcance Resultados Excepcionais."},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"28b6ff31-52fc-4623-98ce-40c1106f3578","linkId":"28b6ff31-52fc-4623-98ce-40c1106f3578","name":"Retaguarda","folder":null,"paths":{"en":"home","pt":"retaguarda","default":"retaguarda"},"langs":["pt"],"cmsDataSetPath":null,"sections":[{"uid":"baba2193-df06-4e15-a0c4-b4ee0fd1339c","sectionTitle":"Responsive Sidemenu - Copy","linkId":"0dfe28d3-328f-4abe-ab17-c0a3e309fa30"},{"uid":"4f474271-6e4f-4a50-b3da-7eb04bc6099a","sectionTitle":"Responsive Sidemenu","linkId":"cd916d01-3d80-450f-9de7-c06e0d8802a6"},{"uid":"7e568fda-369e-410d-9088-7e974d75f24d","sectionTitle":"Retaguarda - addTipoDado","linkId":"c1e46286-bedb-4835-8dd8-1bd639f544a4"},{"uid":"371bf10a-0c97-4be5-8654-448a7059c4c5","sectionTitle":"Retaguarda - addPermissão","linkId":"2eac2ba9-5289-4f8f-b288-e7380fc66010"},{"uid":"59464b65-bad6-42ce-93c2-c0408e53de88","sectionTitle":"Retaguarda - addPerfil","linkId":"86b0054d-a654-407f-92b3-ca59d8fc2a32"},{"uid":"49ff340c-6b29-42e7-80e9-fd9cada3eb2a","sectionTitle":"Retaguarda - addTipoItem","linkId":"b43e766b-e067-4a47-907f-92561b59ca72"},{"uid":"c05d1d11-7580-4543-abeb-9b15acdcf13e","sectionTitle":"Retaguarda - editTipoItem","linkId":"5e6cbe25-18e5-476d-9d3e-123230fa3147"},{"uid":"f8d32f91-4468-4e22-9d90-683dd5b63cad","sectionTitle":"Retaguarda - addCycle","linkId":"443c4ed8-0214-4b5f-bdb9-1e1000ab186f"},{"uid":"819ff5a3-e532-438c-baea-5640fe99d0f0","sectionTitle":"Retaguarda - addKanban","linkId":"c9068807-d7c6-422e-952c-731a38613f13"},{"uid":"1054c5e6-83f6-4e4e-9356-10846441f75c","sectionTitle":"Retaguarda - editCycle","linkId":"6643f356-6f1a-4dc7-9065-4f84577f4527"},{"uid":"d9de3d50-d7a9-4f4e-a174-5d42be998af9","sectionTitle":"Retaguarda - addPermissaoToPerfil","linkId":"50540bb1-6261-4840-8ef5-506ce80b5b46"},{"uid":"bffe5463-d3a3-4f76-b7ad-9a6b1c37e92f","sectionTitle":"Retaguarda - addPerfilToUser","linkId":"b44a363d-94bc-489b-9a9b-fd75e4fb721c"},{"uid":"9b1af21f-0221-4b10-ab59-6318415987b9","sectionTitle":"Retaguarda - TipoDeDado page","linkId":"b63ed11a-aeaf-447a-a6a3-4bc8c9f31087"},{"uid":"dcb9929c-6bf8-48ed-a1d6-cc5c6030d2eb","sectionTitle":"Retaguarda - Kanban page","linkId":"981c1521-ca19-4a45-b2df-9a2ee46a71c8"},{"uid":"e6791b98-f689-4c0f-98cc-71189d56a677","sectionTitle":"Retaguarda - TipoDeItem page","linkId":"efabdd3d-3bdf-47a0-b0f8-40eab1cd9932"},{"uid":"b4c25b1e-06f7-4eb0-bf55-66a3232db7c7","sectionTitle":"Retaguarda - Permissao page","linkId":"066fe462-838b-42b7-88d8-fdd7b14ae887"},{"uid":"3e00b7fc-be99-4953-94b7-49e4e9a5fd0a","sectionTitle":"Retaguarda - Perfil page","linkId":"f94271e6-d748-45c4-9141-78d71377c46c"},{"uid":"536f85ea-1d58-4bb2-9e64-c64cea10abc0","sectionTitle":"Retaguarda - Colaboradores page","linkId":"d418cb0a-2abc-4546-8cea-16fce0b26d91"},{"uid":"50b9765f-a88d-4bb1-a5a2-f106ead8db75","sectionTitle":"Retaguarda - Informações page","linkId":"503261d0-7acd-43f0-a10f-82c8ed50fe99"},{"uid":"19f333d6-0bcc-4181-9fb5-7f1447c08f9c","sectionTitle":"Made with Weweb","linkId":"71b66f0f-8e6d-46cc-b2c2-13b847b5e92e"},{"uid":"3e4d7a49-4a18-40ae-b4e4-736f0b101407","sectionTitle":"Alert","linkId":"d1dc9cea-3abe-4e43-b115-a19895288242"}],"pageUserGroups":[{}],"title":{"en":"Unimble app","fr":"Vide | Commencer à partir de zéro"},"meta":{"desc":{"en":"Eleve a Gestão do seu Negócio e Alcance Resultados Excepcionais."},"keywords":{},"socialDesc":{},"socialTitle":{}},"metaImage":""},{"id":"02eb5726-afd0-4580-b0c9-8f88c2b72ae7","linkId":"02eb5726-afd0-4580-b0c9-8f88c2b72ae7","name":"inicio","folder":null,"paths":{"en":"inicio","pt":"inicio","default":"inicio"},"langs":["pt"],"cmsDataSetPath":null,"sections":[{"uid":"8df61152-97ca-4c05-84ab-bc4bdf8bba9d","sectionTitle":"Alert section","linkId":"879c13db-97ab-4096-912b-42e0eb394d6e"},{"uid":"26b49598-f13b-4ec6-bb6f-7899e91afde6","sectionTitle":"Menu","linkId":"666b1ec8-ce9e-4672-89ae-38f40945c2b2"},{"uid":"759e435f-e46d-48f1-8ce8-10f542bee9c8","sectionTitle":"Main","linkId":"254be625-cd98-4b3f-9fdf-5e0c7b05a66e"},{"uid":"d2854075-8d2d-4ac6-9aad-dfeac62ed1d9","sectionTitle":"Alert (Depreciado)","linkId":"c248e981-729a-4eb7-9d0f-2a46d10c6e31"},{"uid":"ebf24992-7a55-4c0e-837e-dc6ac22da4f9","sectionTitle":"Modal","linkId":"cdd6b822-dd64-41a2-90be-3de67ba5535a"},{"uid":"a0fc4a65-e064-47ec-b570-59923851c00e","sectionTitle":"Confirmation","linkId":"33d0b4c0-ef56-40ac-8d17-1ed4f7aca851"},{"uid":"d4999034-87e6-46bd-a0ca-24bbd8d65bdd","sectionTitle":"Alert","linkId":"ecc9a536-a4cf-40fc-8043-8678920b442d"}],"pageUserGroups":[{}],"title":{"en":"Unimble app","fr":"Vide | Commencer à partir de zéro"},"meta":{"desc":{"en":"Eleve a Gestão do seu Negócio e Alcance Resultados Excepcionais."},"keywords":{},"socialDesc":{},"socialTitle":{}},"metaImage":""},{"id":"001deef1-5715-4995-a8d2-0e85c7ee6eb1","linkId":"001deef1-5715-4995-a8d2-0e85c7ee6eb1","name":"Recuperar senha","folder":null,"paths":{"pt":"recuperar/{{param|33efe9fc-b456-4809-9984-a5ac1859d2a5}}","default":"recuperar/{{param|33efe9fc-b456-4809-9984-a5ac1859d2a5}}"},"langs":["pt"],"cmsDataSetPath":null,"sections":[{"uid":"9e3e029c-3111-47a4-ae64-63fb575a8607","sectionTitle":"Section","linkId":"58c81154-a9b8-40b6-b246-7ea8602cafe2"},{"uid":"74f8271f-05fc-45be-9d4d-05ce4887afc5","sectionTitle":"LoginForm","linkId":"df6569fb-2bdd-4d59-841c-a137d6fb71eb"},{"uid":"3e4d7a49-4a18-40ae-b4e4-736f0b101407","sectionTitle":"Alert","linkId":"d1dc9cea-3abe-4e43-b115-a19895288242"}],"pageUserGroups":[],"title":{"en":"Unimble app"},"meta":{"desc":{"en":"Eleve a Gestão do seu Negócio e Alcance Resultados Excepcionais."},"keywords":{},"socialDesc":{},"socialTitle":{}},"metaImage":""},{"id":"dda383e4-9de6-43c9-92a9-68e3e1980b67","linkId":"dda383e4-9de6-43c9-92a9-68e3e1980b67","name":"Login","folder":null,"paths":{"en":"login","default":"login"},"langs":["pt"],"cmsDataSetPath":null,"sections":[{"uid":"6c3f0bde-9bb4-4125-9e8b-71b5cc1915b3","sectionTitle":"Section","linkId":"9de553b6-0954-4a93-8713-d8d8ddd2771d"},{"uid":"23f02a5e-93a6-4caa-b06b-afacf1c16b76","sectionTitle":"LoginForm","linkId":"7a065bd2-cd4e-4d5d-b64b-180c7fe54d5f"},{"uid":"3e4d7a49-4a18-40ae-b4e4-736f0b101407","sectionTitle":"Alert","linkId":"d1dc9cea-3abe-4e43-b115-a19895288242"}],"pageUserGroups":[],"title":{"en":"Unimble app"},"meta":{"desc":{"en":"Eleve a Gestão do seu Negócio e Alcance Resultados Excepcionais."},"keywords":{},"socialDesc":{},"socialTitle":{}},"metaImage":""}],"plugins":[{"id":"f9ef41c3-1c53-4857-855b-f2f6a40b7186","name":"Supabase","namespace":"supabase"},{"id":"1fa0dd68-5069-436c-9a7d-3b54c340f1fa","name":"Supabase Auth","namespace":"supabaseAuth"},{"id":"97e7b1ae-f88a-4697-849c-ee56ab49bb48","name":"JavaScript","namespace":"javascript"},{"id":"9c40819b-4a8f-468f-9ba5-4b9699f3361f","name":"Charts","namespace":"chartjs"},{"id":"832d6f7a-42c3-43f1-a3ce-9a678272f811","name":"Date","namespace":"dayjs"},{"id":"2bd1c688-31c5-443e-ae25-59aa5b6431fb","name":"REST API","namespace":"restApi"}]};
// eslint-disable-next-line no-undef
window.wwg_cacheVersion = 83;
// eslint-disable-next-line no-undef
window.wwg_pluginsSettings = pluginsSettings;
// eslint-disable-next-line no-undef
window.wwg_disableManifest = false;

const defaultLang = window.wwg_designInfo.langs.find(({ default: isDefault }) => isDefault) || {};

const registerRoute = (page, lang, forcedPath) => {
    const langSlug = !lang.default || lang.isDefaultPath ? `/${lang.lang}` : '';
    let path =
        forcedPath ||
        (page.id === window.wwg_designInfo.homePageId ? '/' : `/${page.paths[lang.lang] || page.paths.default}`);

    //Replace params
    path = path.replace(/{{([\w]+)\|([^/]+)?}}/g, ':$1');

    routes.push({
        path: langSlug + path,
        component: wwPage,
        name: `page-${page.id}-${lang.lang}`,
        meta: {
            pageId: page.id,
            lang,
            isPrivate: !!page.pageUserGroups?.length,
        },
        async beforeEnter(to, from) {
            if (to.name === from.name) return;
            //Set page lang
            wwLib.wwLang.defaultLang = defaultLang.lang;
            wwLib.$store.dispatch('front/setLang', lang.lang);

            //Init plugins
            await initializePlugins();

            //Check if private page
            if (page.pageUserGroups?.length) {
                // cancel navigation if no plugin
                if (!wwLib.wwAuth.plugin) {
                    return false;
                }

                await wwLib.wwAuth.init();

                // Redirect to not sign in page if not logged
                if (!wwLib.wwAuth.getIsAuthenticated()) {
                    window.location.href = `${wwLib.wwPageHelper.getPagePath(
                        wwLib.wwAuth.getUnauthenticatedPageId()
                    )}?_source=${to.path}`;

                    return null;
                }

                //Check roles are required
                if (
                    page.pageUserGroups.length > 1 &&
                    !wwLib.wwAuth.matchUserGroups(page.pageUserGroups.map(({ userGroup }) => userGroup))
                ) {
                    window.location.href = `${wwLib.wwPageHelper.getPagePath(
                        wwLib.wwAuth.getUnauthorizedPageId()
                    )}?_source=${to.path}`;

                    return null;
                }
            }

            try {
                await import(`@/pages/${page.id.split('_')[0]}.js`);
                await wwLib.wwWebsiteData.fetchPage(page.id);

                //Scroll to section or on top after page change
                if (to.hash) {
                    const targetElement = document.getElementById(to.hash.replace('#', ''));
                    if (targetElement) targetElement.scrollIntoView();
                } else {
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                }

                return;
            } catch (err) {
                wwLib.$store.dispatch('front/showPageLoadProgress', false);

                if (err.redirectUrl) {
                    return { path: err.redirectUrl || '404' };
                } else {
                    //Any other error: go to target page using window.location
                    window.location = to.fullPath;
                }
            }
        },
    });
};

for (const page of window.wwg_designInfo.pages) {
    for (const lang of window.wwg_designInfo.langs) {
        if (!page.langs.includes(lang.lang)) continue;
        registerRoute(page, lang);
    }
}

const page404 = window.wwg_designInfo.pages.find(page => page.paths.default === '404');
if (page404) {
    for (const lang of window.wwg_designInfo.langs) {
        // Create routes /:lang/:pathMatch(.*)* etc for all langs of the 404 page
        if (!page404.langs.includes(lang.lang)) continue;
        registerRoute(
            page404,
            {
                default: false,
                lang: lang.lang,
            },
            '/:pathMatch(.*)*'
        );
    }
    // Create route /:pathMatch(.*)* using default project lang
    registerRoute(page404, { default: true, isDefaultPath: false, lang: defaultLang.lang }, '/:pathMatch(.*)*');
} else {
    routes.push({
        path: '/:pathMatch(.*)*',
        async beforeEnter() {
            window.location.href = '/404';
        },
    });
}

let routerOptions = {};

const isProd =
    !window.location.host.includes(
        // TODO: add staging2 ?
        '-staging.' + (process.env.WW_ENV === 'staging' ? import.meta.env.VITE_APP_PREVIEW_URL : '')
    ) && !window.location.host.includes(import.meta.env.VITE_APP_PREVIEW_URL);

if (isProd && window.wwg_designInfo.baseTag?.href) {
    let baseTag = window.wwg_designInfo.baseTag.href;
    if (!baseTag.startsWith('/')) {
        baseTag = '/' + baseTag;
    }
    if (!baseTag.endsWith('/')) {
        baseTag += '/';
    }

    routerOptions = {
        base: baseTag,
        history: createWebHistory(baseTag),
        routes,
    };
} else {
    routerOptions = {
        history: createWebHistory(),
        routes,
    };
}

router = createRouter({
    ...routerOptions,
    scrollBehavior,
});

//Trigger on page unload
let isFirstNavigation = true;
router.beforeEach(async (to, from) => {
    if (to.name === from.name) return;
    if (!isFirstNavigation) await onPageUnload();
    isFirstNavigation = false;
    wwLib.globalVariables._navigationId++;
    return;
});

//Init page
router.afterEach((to, from, failure) => {
    wwLib.$store.dispatch('front/showPageLoadProgress', false);
    let fromPath = from.path;
    let toPath = to.path;
    if (!fromPath.endsWith('/')) fromPath = fromPath + '/';
    if (!toPath.endsWith('/')) toPath = toPath + '/';
    if (failure || (from.name && toPath === fromPath)) return;
    initializeData(to);
});
/* wwFront:end */

export default router;
