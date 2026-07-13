const { test, expect } = require('../framework/fixtures/studio');
const {
  StudioProjectsPage,
  StudioModulesPage,
  StudioExperienceJourneyPage,
} = require('../framework/pages/studio');

test.describe('VRSE Studio', () => {
  test('complete project and module workflow', async ({ studioPage: page }) => {
    test.setTimeout(1200000);

    const projects = new StudioProjectsPage(page);
    const modules = new StudioModulesPage(page);
    const journey = new StudioExperienceJourneyPage(page);

    const projectName = `AutoProject_${Date.now()}`;
    const updatedProjectName = `${projectName}_edited`;
    const moduleProjectName = `AutoModuleProject_${Date.now()}`;
    const moduleNamePhaseOne = `AutoModule_A_${Date.now()}`;
    const updatedModuleNamePhaseOne = `${moduleNamePhaseOne}_edited`;
    const moduleNameForExperience = `AutoModule_Exp_${Date.now()}`;

    console.debug('[Studio] Starting complete project and module workflow');

    // Create project
    console.debug('[Studio] Creating project');
    await projects.createProject({ name: projectName, description: 'Automated test project' });
    await expect(page.getByRole('heading', { name: 'Modules', exact: true })).toBeVisible();

    // Edit project
    console.debug('[Studio] Updating project');
    await projects.editProject(projectName, {
      name: updatedProjectName,
      description: 'Updated description',
    });

    // Delete project
    console.debug('[Studio] Deleting project');
    await projects.deleteProject(updatedProjectName);

    // Create project for module testing
    console.debug('[Studio] Creating project for module testing');
    await projects.createProject({ name: moduleProjectName, description: 'Module test project' });
    await expect(page.getByRole('heading', { name: 'Modules', exact: true })).toBeVisible();

    // Module flow 1: create -> edit -> delete
    console.debug('[Studio] Creating module (phase one)');
    await modules.createModule({
      name: moduleNamePhaseOne,
      description: 'Automated test module',
      type: 'Training',
    });

    console.debug('[Studio] Updating module (phase one)');
    await modules.editModule(moduleNamePhaseOne, {
      name: updatedModuleNamePhaseOne,
      description: 'Updated module description phase one',
      type: 'Non-Training',
    });

    console.debug('[Studio] Deleting module (phase one)');
    await modules.deleteModule(updatedModuleNamePhaseOne);

    // Create module again for experience journey flow
    console.debug('[Studio] Creating module for experience workflow');
    await modules.createModule({
      name: moduleNameForExperience,
      description: 'Module for experience workflow',
      type: 'Training',
    });

    // Create experience and run Use Template journey flow
    const useTemplateName = `AutoExp_UseTemplate_${Date.now()}`;
    console.debug('[Studio] Starting Use Template workflow');
    await journey.runUseTemplateWorkflow({
      name: useTemplateName,
      description: 'Automated experience via Use Template',
      type: 'Training',
    });

    // Re-open created project -> module -> experience and continue dashboard authoring flow.
    console.debug('[Studio] Re-opening project for dashboard flow');
    await projects.openProject(moduleProjectName);
    await modules.openModule(moduleNameForExperience);
    await journey.openExperience(useTemplateName);
    console.debug('[Studio] Running post-redirect dashboard flow');
    const shareLink = await journey.runPostRedirectDashboardFlow();
    console.debug(`[Studio] Share Link: ${shareLink}`);
    expect(shareLink).toMatch(/^https?:\/\//i);

    // Re-open same project/module/experience and validate left + middle Non-Technical coverage.
    console.debug('[Studio] Re-opening project for left/middle Non-Technical flow');
    await projects.openProject(moduleProjectName);
    await modules.openModule(moduleNameForExperience);
    await journey.openExperience(useTemplateName);
    await journey.runLeftAndMiddleNonTechnicalFlow();

    console.debug('[Studio] Complete project and module workflow finished');

    // Other journey types (VRseAI, Load JSON, Go with AI) — to be added next
    // await journey.runVrseAIWorkflow({ ... });
    // await journey.runLoadJsonWorkflow({ ... });
    // await journey.runGoWithAIWorkflow({ ... });
  });
});
