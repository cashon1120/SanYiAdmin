import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

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
