<script> 
  import { onMount } from "svelte";
  const API = import.meta.env.VITE_API_URL;
  console.log("API URL:", API);

  let title = "";
  let content = "";
  let notes = [];
  let editId = null;

  // Ambil semua notes
  async function getNotes() {
    try {
      const res = await fetch(API + "/notes");
      const data = await res.json();

      console.log("DATA:", data);
      notes = data;
    } catch (err) {
      console.log("ERROR GET:", err);
    }
  }

  // Saat web pertama dibuka
  onMount(() => {
    getNotes();
  });

  // Simpan note / update note
  async function saveNote() {
    try {
      let url = API + "/notes";
      let method = "POST";

      // kalau sedang edit → pakai PUT
      if (editId !== null) {
        url = API + "notes/" + editId;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title,
          content: content
        })
      });

      const result = await response.text();
      console.log(result);

      await getNotes();

      // reset form
      title = "";
      content = "";
      editId = null;

    } catch (err) {
      console.log("ERROR SAVE:", err);
    }
  }

  // Edit note
  function editNote(note) {
    title = note.title;
    content = note.content;
    editId = note.id;
  }

  // Hapus note
  async function deleteNote(id) {
    const confirmDelete = confirm("Yakin mau hapus note?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(API + "/notes/"+ id, {
        method: "DELETE"
      });

      const result = await res.text();
      console.log(result);

      await getNotes();

    } catch (err) {
      console.log("ERROR DELETE:", err);
    }
  }
</script>

<h1>Notepad App</h1>

<input
  placeholder="Judul Note"
  bind:value={title}
/>

<br><br>

<textarea
  placeholder="Isi Note"
  bind:value={content}>
</textarea>

<br><br>

<button on:click={saveNote}>
  {editId ? "Update Note" : "Simpan Note"}
</button>

<h2>Daftar Note</h2>

{#each notes as note}
  <div>
    <h3>{note.title}</h3>
    <p>{note.content}</p>
    <p>ID: {note.id}</p>

    <button on:click={() => editNote(note)}>
      Edit
    </button>

    <button on:click={() => deleteNote(note.id)}>
      Hapus
    </button>
  </div>
{/each}

<style>
  h1 {
    text-align: center;
  }

  input,
  textarea {
    width: 300px;
    padding: 10px;
  }

  textarea {
    height: 100px;
  }

  button {
    padding: 10px 20px;
    background: black;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 10px;
  }

  div {
    border: 1px solid #ccc;
    padding: 10px;
    margin-top: 10px;
    width: 300px;
  }
</style>