<script>
  //Svelte Imports
  import Editor from "./Editor.svelte";
  import Preview from "./Preview.svelte";

  let markdown =
    "# You can enter markdown here\n\n**This text is bold**\n\n_This text is italic_";
  let activeFilePath;

  //When a new file is opened, update the state
  window.api.on("fileopened", (e, { path, content }) => {
    activeFilePath = path;
    markdown = content;
  });

  //When a file save is triggered, send the active file details to Electron
  window.api.on("savefile", () => {
    if (activeFilePath) {
      window.api.send("saveexistingfile", {
        path: activeFilePath,
        content: markdown,
      });
    } else {
      window.api.send("savenewfile", markdown);
    }
  });
</script>

<main>
  <p class="file-path">
    {activeFilePath ? activeFilePath : "Press 'Save' or hit 'CTRL + S' to save"}
  </p>

  <div class="editor-and-preview">
    <Editor bind:markdown />
    <Preview {markdown} />
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
  }

  .file-path {
    font-weight: bold;
  }

  .editor-and-preview {
    display: flex;
    flex-direction: row;
  }
</style>
