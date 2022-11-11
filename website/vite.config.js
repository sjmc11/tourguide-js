import { defineConfig } from 'vite';
import * as path from "path";
import { resolve } from 'path'

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                docs: resolve(__dirname, 'docs/index.html'),
                docs_steps: resolve(__dirname, 'docs/steps.html'),
                docs_options: resolve(__dirname, 'docs/options.html'),
                docs_events: resolve(__dirname, 'docs/events.html'),
                docs_methods: resolve(__dirname, 'docs/methods.html'),
                docs_properties: resolve(__dirname, 'docs/properties.html'),
            }
        }
    }
});