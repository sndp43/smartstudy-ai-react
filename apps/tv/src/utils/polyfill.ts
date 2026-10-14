// Polyfill global.window and addEventListener for @noriginmedia/norigin-spatial-navigation in React Native

const g: any = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : {};

if (!g.window) {
  g.window = {};
}

const win = g.window;

if (typeof win.addEventListener !== 'function') {
  const listeners: Record<string, Function[]> = win.listeners || {};
  win.listeners = listeners;

  win.addEventListener = (type: string, fn: Function) => {
    listeners[type] = listeners[type] || [];
    listeners[type].push(fn);
  };

  win.removeEventListener = (type: string, fn: Function) => {
    if (listeners[type]) {
      listeners[type] = listeners[type].filter((f: Function) => f !== fn);
    }
  };

  win.dispatchEvent = (event: any) => {
    const fns = listeners[event.type] || [];
    fns.forEach((fn: Function) => {
      try {
        fn(event);
      } catch (e) {
        console.warn('Error in window event listener:', e);
      }
    });
  };
}
