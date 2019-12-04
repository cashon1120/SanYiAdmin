import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'addExecl', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/addExecl.js').default) });
app.model({ namespace: 'assemblyParts', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/assemblyParts.js').default) });
app.model({ namespace: 'characterManager', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/characterManager.js').default) });
app.model({ namespace: 'chassisComponent', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/chassisComponent.js').default) });
app.model({ namespace: 'chassisSystem', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/chassisSystem.js').default) });
app.model({ namespace: 'departmentManager', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/departmentManager.js').default) });
app.model({ namespace: 'importantParts', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/importantParts.js').default) });
app.model({ namespace: 'login', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/login.js').default) });
app.model({ namespace: 'pointCheckCar', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/pointCheckCar.js').default) });
app.model({ namespace: 'pointCheckProject', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/pointCheckProject.js').default) });
app.model({ namespace: 'pointCheckSystem', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/pointCheckSystem.js').default) });
app.model({ namespace: 'pointCheckTable', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/pointCheckTable.js').default) });
app.model({ namespace: 'pointCheckType', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/pointCheckType.js').default) });
app.model({ namespace: 'publicModel', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/publicModel.js').default) });
app.model({ namespace: 'resourceManager', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/resourceManager.js').default) });
app.model({ namespace: 'role', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/role.js').default) });
app.model({ namespace: 'userManager', ...(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/src/models/userManager.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
