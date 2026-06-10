package com.crud.api.controller;


import com.crud.api.model.Registro;
import com.crud.api.repository.RegistroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/registros")
@CrossOrigin(origins = "*") // Permite que Front-end converse com a API
public class RegistroController {

    @Autowired
    private RegistroRepository repository;

    // Rota para LER todos os registros (GET)
    @GetMapping
    public List<Registro> listarTodos() {
        return repository.findAll();
    }

    // Rota para SALVAR um novo registro (POST)
    @PostMapping
    public Registro adicionar(@RequestBody Registro registro) {
        return repository.save(registro);
    }

    // Rota para ATUALIZAR um registro existente (PUT)
    @PutMapping("/{id}")
    public Registro atualizar(@PathVariable Integer id, @RequestBody Registro registroAtualizado) {
        registroAtualizado.setId(id); // Garante que vamos alterar a linha certa do banco
        return repository.save(registroAtualizado);
    }

    // Rota para EXCLUIR um registro (DELETE)
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}