new EventSource('/esbuild').addEventListener('change', () => location.reload())
import React, { useCallback, useState } from "react";
import { createRoot } from 'react-dom/client';

import {App }from "./App";
const container = document.getElementById('root')!;
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App message="whatever"/>);
