import { FuseNavigation } from "@fuse/types";

export const navigation: FuseNavigation[] = [
    {
        id: "applications",
        title: "Páginas",
        type: "group",
        children: [
            {
                id: "inicio",
                title: "Inicio",
                type: "item",
                icon: "home",
                url: "/",
            },
        ],
    },
];
