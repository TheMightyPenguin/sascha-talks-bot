#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { SaschaTalksBotStack } from '../lib/sascha-talks-bot-stack';

const app = new cdk.App();
new SaschaTalksBotStack(app, 'SaschaTalksBotStack');
