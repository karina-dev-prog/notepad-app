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
        url = API + "/notes/" + editId;
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
  :global(body) {
    margin: 0;
    padding: 0;
    background: linear-gradient(to right, #b5aea7, #534f4f);
    font-family: Arial, sans-serif;
  }

  h1 {
    text-align: center;
    color: #222;
    margin-top: 30px;
    margin-bottom: 25px;
    font-size: 40px;
  }

  h2 {
    text-align: center;
    margin-top: 40px;
    color: #333;
  }

  input,
  textarea {
    width: 400px;
    padding: 14px;
    border-radius: 12px;
    border: 1px solid #c69f9f;
    outline: none;
    font-size: 15px;
    display: block;
    margin: auto;
    box-shadow: 0 3px 8px rgba(0,0,0,0.08);
  }

  textarea {
    height: 120px;
    resize: none;
  }

  button {
    padding: 12px 20px;
    background: black;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    margin-top: 10px;
    margin-right: 10px;
    transition: 0.2s;
    font-weight: bold;
  }

  button:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

  div {
    background: rgb(236, 228, 228);
    padding: 20px;
    margin: 20px auto;
    width: 420px;
    border-radius: 18px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  h3 {
    margin: 0;
    color: #222;
  }

  p {
    color: #555;
    line-height: 1.5;
  }

  br {
    display: none;
  }

  button:last-child {
    background: crimson;
  }

  button:first-child {
    background: orange;
  }
</style>