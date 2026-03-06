// Quick and dirty tool to auto add colors so no manual config is needed

import fs from "fs";
import path from "path";
import { select, text } from '@clack/prompts';

async function main() {
    let other_color_type: any | null = null;
    let final: string | null = null;

    let color_type = await select({
        message: 'Pick a color type:',
        options: [
            { value: 'primary', label: 'Primary' },
            { value: 'secondary', label: 'Secondary' },
            { value: 'other', label: 'Other' },
        ],
    });

    let hex_code = await String(text({ message: 'Enter the hex code for the color' }));

    if (color_type === "other") {
        other_color_type = await text({
            message: 'What should the prefix of the color be?',
        });
    }

    let color_name = await text({ message: 'Enter unique name for the color' });

    if (other_color_type != null) {
        final = `${other_color_type}-${String(color_name)}`;
    }

    const currentdir = process.cwd();
    const globalcss = path.join(currentdir, "src/app/global.css");
    const tailwindconfig = path.join(currentdir, "tailwind.config.js");

    const globalcss_content = fs.readFileSync(globalcss, "utf-8");
    const tailwindconfig_content = fs.readFileSync(tailwindconfig, "utf-8");

    const new_globalcss_content = globalcss_content.replace(/(@theme {)/, `$1\n      --color-${final}: ${hex_code};`);
    const new_tailwindconfig_content = tailwindconfig_content.replace(/(extend: {)/, `$1\n        colors: {\n          ${final}: 'var(--color-${final})',\n        },`);

    fs.writeFileSync(globalcss, new_globalcss_content);
    fs.writeFileSync(tailwindconfig, new_tailwindconfig_content);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});