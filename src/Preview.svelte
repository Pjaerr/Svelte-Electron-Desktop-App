<script>
    import marked from "marked";
    export let markdown = "";
</script>

<style>
    section {
        width: 100%;
        min-height: 95vh;
        margin-left: 0.5rem;
        padding: 0.2rem;
        flex: 2;
        background-color: #f5f5f5;
    }

    section :global(*) {
        word-break: break-word;
        white-space: pre-wrap;
    }
</style>

<section>
    {@html marked(markdown)}
</section>