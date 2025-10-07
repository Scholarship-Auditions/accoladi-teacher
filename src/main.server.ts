import { bootstrapApplication } from '@angular/platform-browser';
import { Layout } from './app/layout/layout';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(Layout, config);

export default bootstrap;
