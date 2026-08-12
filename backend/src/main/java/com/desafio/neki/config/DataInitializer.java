package com.desafio.neki.config;

import com.desafio.neki.entity.Skill;
import com.desafio.neki.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Popula o catálogo de skills com dados de exemplo caso esteja vazio.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final SkillRepository skillRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (skillRepository.count() > 0) {
            return;
        }

        List<Skill> skills = List.of(
                Skill.builder()
                        .nome("Java")
                        .categoria("Backend")
                        .imagemUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg")
                        .descricao("Linguagem de programação orientada a objetos amplamente usada em aplicações enterprise.")
                        .build(),
                Skill.builder()
                        .nome("Python")
                        .categoria("Dados")
                        .imagemUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg")
                        .descricao("Linguagem versátil, muito utilizada em análise de dados, IA e automação.")
                        .build(),
                Skill.builder()
                        .nome("JavaScript")
                        .categoria("Web")
                        .imagemUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg")
                        .descricao("Linguagem que dá dinamismo às páginas web e roda no navegador e no servidor.")
                        .build(),
                Skill.builder()
                        .nome("React")
                        .categoria("Frontend")
                        .imagemUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg")
                        .descricao("Biblioteca JavaScript para construção de interfaces de usuário modernas.")
                        .build(),
                Skill.builder()
                        .nome("Node.js")
                        .categoria("Backend")
                        .imagemUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg")
                        .descricao("Ambiente de execução JavaScript no servidor, focado em escalabilidade.")
                        .build(),
                Skill.builder()
                        .nome("PostgreSQL")
                        .categoria("Banco")
                        .imagemUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg")
                        .descricao("Banco de dados relacional open source, robusto e extensível.")
                        .build(),
                Skill.builder()
                        .nome("MongoDB")
                        .categoria("Banco")
                        .imagemUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg")
                        .descricao("Banco de dados NoSQL orientado a documentos, com esquema flexível.")
                        .build(),
                Skill.builder()
                        .nome("Git")
                        .categoria("Versionamento")
                        .imagemUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg")
                        .descricao("Sistema de controle de versão distribuído usado em praticamente todos os projetos.")
                        .build(),
                Skill.builder()
                        .nome("Docker")
                        .categoria("DevOps")
                        .imagemUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg")
                        .descricao("Plataforma de containers para empacotar e executar aplicações de forma isolada.")
                        .build(),
                Skill.builder()
                        .nome("AWS")
                        .categoria("Cloud")
                        .imagemUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg")
                        .descricao("Plataforma de serviços de computação em nuvem líder de mercado.")
                        .build(),
                Skill.builder()
                        .nome("Linux")
                        .categoria("Sistemas")
                        .imagemUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg")
                        .descricao("Sistema operacional open source amplamente usado em servidores.")
                        .build(),
                Skill.builder()
                        .nome("Figma")
                        .categoria("Design")
                        .imagemUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg")
                        .descricao("Ferramenta colaborativa de design de interfaces e prototipação.")
                        .build(),
                Skill.builder()
                        .nome("Power BI")
                        .categoria("BI")
                        .imagemUrl("https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg")
                        .descricao("Ferramenta da Microsoft para visualização de dados e dashboards.")
                        .build(),
                Skill.builder()
                        .nome("Kubernetes")
                        .categoria("DevOps")
                        .imagemUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg")
                        .descricao("Orquestrador de containers para deploy, escala e operação de aplicações.")
                        .build(),
                Skill.builder()
                        .nome("C++")
                        .categoria("HPC")
                        .imagemUrl("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg")
                        .descricao("Linguagem de alto desempenho para sistemas e computação de baixa latência.")
                        .build());

        skillRepository.saveAll(skills);
        log.info("Catálogo de skills populado com {} skills de exemplo.", skills.size());
    }
}
