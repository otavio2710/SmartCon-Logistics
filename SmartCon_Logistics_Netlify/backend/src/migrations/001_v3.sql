CREATE TABLE IF NOT EXISTS lotes (
 id BIGSERIAL PRIMARY KEY, criado_em TIMESTAMPTZ NOT NULL DEFAULT now(), usuario TEXT,
 plataforma TEXT NOT NULL DEFAULT 'outros', total_etiquetas INT NOT NULL DEFAULT 0,
 conciliadas INT NOT NULL DEFAULT 0, pendentes INT NOT NULL DEFAULT 0, notas_orfas INT NOT NULL DEFAULT 0,
 metadados JSONB NOT NULL DEFAULT '{}'::jsonb, resultado JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_lotes_criado_em ON lotes(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_lotes_plataforma ON lotes(plataforma);
