--
-- PostgreSQL database dump
--

\restrict S2fOs1brkvgy8uZ0PMShdSMcqFHKhx00rLJat4TKKE8iXAQmKPd0WvI0oBjwLun

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.inventario_mal_estado DROP CONSTRAINT IF EXISTS inventario_mal_estado_entrega_id_fkey;
ALTER TABLE IF EXISTS ONLY public.inventario_mal_estado DROP CONSTRAINT IF EXISTS inventario_mal_estado_devolucion_id_fkey;
ALTER TABLE IF EXISTS ONLY public.historial_cambios_inventario DROP CONSTRAINT IF EXISTS historial_cambios_inventario_inventario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.entregas DROP CONSTRAINT IF EXISTS fk_entrega_personal;
ALTER TABLE IF EXISTS ONLY public.detalle_entrega DROP CONSTRAINT IF EXISTS fk_detalle_inventario;
ALTER TABLE IF EXISTS ONLY public.detalle_entrega DROP CONSTRAINT IF EXISTS fk_detalle_entrega;
ALTER TABLE IF EXISTS ONLY public.devoluciones DROP CONSTRAINT IF EXISTS devoluciones_detalle_entrega_id_fkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_usuario_key;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY public.personal DROP CONSTRAINT IF EXISTS personal_pkey;
ALTER TABLE IF EXISTS ONLY public.personal DROP CONSTRAINT IF EXISTS personal_cedula_key;
ALTER TABLE IF EXISTS ONLY public.inventario DROP CONSTRAINT IF EXISTS inventario_pkey;
ALTER TABLE IF EXISTS ONLY public.inventario_mal_estado DROP CONSTRAINT IF EXISTS inventario_mal_estado_pkey;
ALTER TABLE IF EXISTS ONLY public.historial_cambios_inventario DROP CONSTRAINT IF EXISTS historial_cambios_inventario_pkey;
ALTER TABLE IF EXISTS ONLY public.entregas DROP CONSTRAINT IF EXISTS entregas_pkey;
ALTER TABLE IF EXISTS ONLY public.devoluciones DROP CONSTRAINT IF EXISTS devoluciones_pkey;
ALTER TABLE IF EXISTS ONLY public.detalle_entrega DROP CONSTRAINT IF EXISTS detalle_entrega_pkey;
ALTER TABLE IF EXISTS public.usuarios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.personal ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.inventario_mal_estado ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.inventario ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.historial_cambios_inventario ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.entregas ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.devoluciones ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.detalle_entrega ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.usuarios_id_seq;
DROP TABLE IF EXISTS public.usuarios;
DROP SEQUENCE IF EXISTS public.personal_id_seq;
DROP TABLE IF EXISTS public.personal;
DROP SEQUENCE IF EXISTS public.inventario_mal_estado_id_seq;
DROP TABLE IF EXISTS public.inventario_mal_estado;
DROP SEQUENCE IF EXISTS public.inventario_id_seq;
DROP TABLE IF EXISTS public.inventario;
DROP SEQUENCE IF EXISTS public.historial_cambios_inventario_id_seq;
DROP TABLE IF EXISTS public.historial_cambios_inventario;
DROP SEQUENCE IF EXISTS public.entregas_id_seq;
DROP TABLE IF EXISTS public.entregas;
DROP SEQUENCE IF EXISTS public.devoluciones_id_seq;
DROP TABLE IF EXISTS public.devoluciones;
DROP SEQUENCE IF EXISTS public.detalle_entrega_id_seq;
DROP TABLE IF EXISTS public.detalle_entrega;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: detalle_entrega; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_entrega (
    id integer NOT NULL,
    entrega_id integer NOT NULL,
    inventario_id integer NOT NULL,
    cantidad integer NOT NULL,
    cantidad_devuelta integer DEFAULT 0
);


ALTER TABLE public.detalle_entrega OWNER TO postgres;

--
-- Name: detalle_entrega_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalle_entrega_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalle_entrega_id_seq OWNER TO postgres;

--
-- Name: detalle_entrega_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalle_entrega_id_seq OWNED BY public.detalle_entrega.id;


--
-- Name: devoluciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devoluciones (
    id integer NOT NULL,
    detalle_entrega_id integer,
    cantidad_devuelta integer NOT NULL,
    causa text NOT NULL,
    fecha_devolucion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.devoluciones OWNER TO postgres;

--
-- Name: devoluciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.devoluciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.devoluciones_id_seq OWNER TO postgres;

--
-- Name: devoluciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.devoluciones_id_seq OWNED BY public.devoluciones.id;


--
-- Name: entregas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.entregas (
    id integer NOT NULL,
    cedula character varying(10) NOT NULL,
    fecha_entrega timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    observaciones text
);


ALTER TABLE public.entregas OWNER TO postgres;

--
-- Name: entregas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.entregas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.entregas_id_seq OWNER TO postgres;

--
-- Name: entregas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.entregas_id_seq OWNED BY public.entregas.id;


--
-- Name: historial_cambios_inventario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_cambios_inventario (
    id integer NOT NULL,
    inventario_id integer,
    nombre_material character varying(255) NOT NULL,
    cantidad_anterior integer NOT NULL,
    cantidad_nueva integer NOT NULL,
    diferencia integer NOT NULL,
    motivo text NOT NULL,
    fecha_cambio timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.historial_cambios_inventario OWNER TO postgres;

--
-- Name: historial_cambios_inventario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_cambios_inventario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_cambios_inventario_id_seq OWNER TO postgres;

--
-- Name: historial_cambios_inventario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_cambios_inventario_id_seq OWNED BY public.historial_cambios_inventario.id;


--
-- Name: inventario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventario (
    id integer NOT NULL,
    nombre_material character varying(255),
    tipo_material character varying(255),
    cantidad integer
);


ALTER TABLE public.inventario OWNER TO postgres;

--
-- Name: inventario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventario_id_seq OWNER TO postgres;

--
-- Name: inventario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventario_id_seq OWNED BY public.inventario.id;


--
-- Name: inventario_mal_estado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventario_mal_estado (
    id integer NOT NULL,
    devolucion_id integer,
    nombre_material character varying(255) NOT NULL,
    cantidad integer NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    entrega_id integer
);


ALTER TABLE public.inventario_mal_estado OWNER TO postgres;

--
-- Name: inventario_mal_estado_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventario_mal_estado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventario_mal_estado_id_seq OWNER TO postgres;

--
-- Name: inventario_mal_estado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventario_mal_estado_id_seq OWNED BY public.inventario_mal_estado.id;


--
-- Name: personal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal (
    id integer NOT NULL,
    nombre character varying(255),
    apellido character varying(255),
    tipo_arma character varying(255),
    grado character varying(255),
    cedula character varying(10),
    activo boolean DEFAULT true
);


ALTER TABLE public.personal OWNER TO postgres;

--
-- Name: personal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_id_seq OWNER TO postgres;

--
-- Name: personal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personal_id_seq OWNED BY public.personal.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    usuario character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    rol character varying(100)
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: detalle_entrega id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_entrega ALTER COLUMN id SET DEFAULT nextval('public.detalle_entrega_id_seq'::regclass);


--
-- Name: devoluciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devoluciones ALTER COLUMN id SET DEFAULT nextval('public.devoluciones_id_seq'::regclass);


--
-- Name: entregas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entregas ALTER COLUMN id SET DEFAULT nextval('public.entregas_id_seq'::regclass);


--
-- Name: historial_cambios_inventario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_cambios_inventario ALTER COLUMN id SET DEFAULT nextval('public.historial_cambios_inventario_id_seq'::regclass);


--
-- Name: inventario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario ALTER COLUMN id SET DEFAULT nextval('public.inventario_id_seq'::regclass);


--
-- Name: inventario_mal_estado id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_mal_estado ALTER COLUMN id SET DEFAULT nextval('public.inventario_mal_estado_id_seq'::regclass);


--
-- Name: personal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal ALTER COLUMN id SET DEFAULT nextval('public.personal_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: detalle_entrega; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalle_entrega (id, entrega_id, inventario_id, cantidad, cantidad_devuelta) FROM stdin;
1	1	31	5	5
2	2	18	5	5
3	3	18	10	10
5	5	18	10	10
4	4	18	10	10
6	6	31	6	6
7	7	18	12	12
8	8	27	3	3
9	9	17	2	0
11	9	22	25	0
10	9	25	100	32
13	11	18	20	20
12	10	25	150	150
15	13	25	7	0
16	13	23	100	0
14	12	28	5	5
\.


--
-- Data for Name: devoluciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.devoluciones (id, detalle_entrega_id, cantidad_devuelta, causa, fecha_devolucion) FROM stdin;
1	1	1	Buen estado	2026-07-13 02:04:05.954427
2	1	4	Buen estado	2026-07-13 02:05:10.646256
3	2	5	Mal estado	2026-07-13 11:15:58.765163
4	3	10	Buen estado	2026-07-13 12:55:17.931635
5	5	2	Buen estado	2026-07-13 14:12:56.825025
6	5	8	Mal estado	2026-07-13 14:13:49.746555
7	4	3	Buen estado	2026-07-13 15:10:30.562639
8	4	7	Buen estado	2026-07-13 15:11:20.427517
9	6	6	Buen estado	2026-07-13 15:48:27.311303
10	7	1	Buen estado	2026-07-15 13:52:11.079971
11	7	11	Buen estado	2026-07-16 10:10:36.022651
12	8	3	Mal estado	2026-07-16 10:39:34.051465
13	10	32	Buen estado	2026-09-26 10:02:42.336457
14	13	19	Buen estado	2026-09-26 10:40:11.62722
15	13	1	Mal estado	2026-09-26 10:41:00.722421
16	12	150	Mal estado	2026-10-19 15:29:55.743005
17	14	5	Buen estado	2026-10-19 15:47:34.143946
\.


--
-- Data for Name: entregas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.entregas (id, cedula, fecha_entrega, observaciones) FROM stdin;
1	1802802171	2026-07-13 02:02:17.574646	Operaciones
2	0703187922	2026-07-13 11:15:44.314194	operaciones
3	1802802171	2026-07-13 12:49:05.128205	Operaciones
4	0602313462	2026-07-13 13:00:16.386239	Operaciones
5	1003165071	2026-07-13 14:11:43.31635	Operaciones  
6	1802802171	2026-07-13 15:16:27.75556	Operaciones\n
7	0703187922	2026-07-15 13:30:42.430934	Operaciones
8	1900485978	2026-07-16 10:09:46.690879	Operaciones
9	1104106263	2026-09-26 10:01:47.513362	Operaciones
10	0504306085	2026-09-26 10:06:45.68531	Operaciones
11	0504306085	2026-09-26 10:37:09.256821	OPERACIONES
12	0605991462	2026-10-19 15:34:41.967134	Operaciones  \n
13	0605991462	2026-10-19 15:43:32.820825	Operaciones 
\.


--
-- Data for Name: historial_cambios_inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_cambios_inventario (id, inventario_id, nombre_material, cantidad_anterior, cantidad_nueva, diferencia, motivo, fecha_cambio) FROM stdin;
1	31	BOTAS  TACTICAS DE JAGUAR	15	25	10	Error  al contar 	2026-06-20 10:35:51.086615
2	31	BOTAS  TACTICAS DE JAGUAR	25	30	5	Mal ala  contar	2026-07-07 14:41:55.845208
3	17	PONCHO DE AGUA	1	0	-1	MAL  CONTEO 	2026-09-26 10:43:32.863038
4	17	PONCHO DE AGUA	0	12	12	Ajuste d e  inventario  \n	2026-10-20 12:17:57.427376
5	19	COCINA INDUSTRIAL DE ACERO INOXIDABLE A GAS 6 QUEMADORES	3	87	84	Nuevo   inventario\n	2026-10-26 14:11:03.829879
6	22	CANTIMPLORA IMPORTADA	45	0	-45	Se  envio  a  otro  comando  	2026-10-26 14:12:44.988212
\.


--
-- Data for Name: inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventario (id, nombre_material, tipo_material, cantidad) FROM stdin;
27	COLCHÓN CHAIDE Y CHAIDE ZAFÍRO	Material de Depósito	80
20	HÍDRICO DE CAMPAÑA MILITAR TIPO REMOLQUE	Material Orgánico	2
24	BOTA TÁCTICA ALFA M-2	Material de Depósito	4
18	PONCHO DE AGUA CAMUFLAJE	Material Orgánico	51
21	CAMA DE HIERRO	Material Orgánico	242
31	BOTAS  TACTICAS DE JAGUAR	Material de Depósito	25
25	LINTERNA MULTIPROPÓSITO CON CARGADOR	Material de Depósito	50
23	CANTIMPLORA PLÁSTICA DE  1 LITRO REDONDA	Material Orgánico	81
28	MOCHILA DE CAMPAÑA DE NYLON CON ARNÉS	Material de Depósito	12
17	PONCHO DE AGUA	Material Orgánico	12
19	COCINA INDUSTRIAL DE ACERO INOXIDABLE A GAS 6 QUEMADORES	Material Orgánico	87
22	CANTIMPLORA IMPORTADA	Material Orgánico	0
26	UNIFORME JAGUAR M-1 BOTA	Material de Depósito	5
\.


--
-- Data for Name: inventario_mal_estado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventario_mal_estado (id, devolucion_id, nombre_material, cantidad, fecha_registro, entrega_id) FROM stdin;
1	3	PONCHO DE AGUA CAMUFLAJE	5	2026-07-13 11:15:58.765163	2
2	6	PONCHO DE AGUA CAMUFLAJE	8	2026-07-13 14:13:49.746555	5
3	12	COLCHÓN CHAIDE Y CHAIDE ZAFÍRO	3	2026-07-16 10:39:34.051465	8
4	15	PONCHO DE AGUA CAMUFLAJE	1	2026-09-26 10:41:00.722421	11
5	16	LINTERNA MULTIPROPÓSITO CON CARGADOR	150	2026-10-19 15:29:55.743005	\N
\.


--
-- Data for Name: personal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personal (id, nombre, apellido, tipo_arma, grado, cedula, activo) FROM stdin;
6	JUAN PABLO	PONCE VILLALBA	MG	MAYO	1003165071	t
4	GALO ROMEL	CARDENAS MORALES	MG	CRNL	1802802171	t
5	FLAVIO LEONARDO	BUSTAMANTE MACAS	MG	MAYO	0703187922	t
19	 JULIO XAVIER	PULLA VIZUETE	TRP	CAPT	1718374943	t
20	JAIME RUBEN	MATUTE NOVO	INT	CAPT	0104020896	t
21	MARCO VINICIO	CARRILLO VILLALVA	INT	CAPT	1719411231	t
22	 JAVIER OSWALDO	VINUEZA SILVA	M.G	TNTE	1723446496	t
24	MARJORIE DANIELA	INTRIAGO VERA	M.G	TNTE	1724159098	t
27	MARIELA ISABEL	MISE PANCHI	INT	SUBT	0504306085	t
29	CRISTHIAN FERNANDO	GUACHO VIÑAN	FUSIL	CPTN	0605991462	t
26	ALEXANDRA MARGARETH	VELASQUEZ JIMENEZ	INT	SUBT	1900485978	t
28	 BELEN DE LOS ANGELES	COLALA JUMBO	M.G	SUBT	1104106263	t
18	 JOSE CARLOS	VIZUETA ARELLANO	M.G	MAYO	0916643836	t
2	MARCO ANTONIO	NOBOA BARRENO	MG	CRNL	0602313462	t
7	WILLIAM ALFREDO	MORENO NAVAS	MG	MAYO	1708895790	f
25	PAOLA ALEJANDRA	NARVAEZ ENRIQUEZ	TRP	TNTE	0401464904	t
23	SANTIAGO ABIMAEL	YUQUILEMA TENE	M.G	TNTE	1718513839	f
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, usuario, password, rol) FROM stdin;
1	admin	$2b$10$iUXlvcvc4JXCkGloGC4yVefdp50fhVRe0nOBZIHtShONqCbmxMbeK	Administrador
\.


--
-- Name: detalle_entrega_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalle_entrega_id_seq', 16, true);


--
-- Name: devoluciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.devoluciones_id_seq', 17, true);


--
-- Name: entregas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.entregas_id_seq', 13, true);


--
-- Name: historial_cambios_inventario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_cambios_inventario_id_seq', 6, true);


--
-- Name: inventario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventario_id_seq', 335, true);


--
-- Name: inventario_mal_estado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventario_mal_estado_id_seq', 5, true);


--
-- Name: personal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personal_id_seq', 29, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, true);


--
-- Name: detalle_entrega detalle_entrega_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_entrega
    ADD CONSTRAINT detalle_entrega_pkey PRIMARY KEY (id);


--
-- Name: devoluciones devoluciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devoluciones
    ADD CONSTRAINT devoluciones_pkey PRIMARY KEY (id);


--
-- Name: entregas entregas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entregas
    ADD CONSTRAINT entregas_pkey PRIMARY KEY (id);


--
-- Name: historial_cambios_inventario historial_cambios_inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_cambios_inventario
    ADD CONSTRAINT historial_cambios_inventario_pkey PRIMARY KEY (id);


--
-- Name: inventario_mal_estado inventario_mal_estado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_mal_estado
    ADD CONSTRAINT inventario_mal_estado_pkey PRIMARY KEY (id);


--
-- Name: inventario inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_pkey PRIMARY KEY (id);


--
-- Name: personal personal_cedula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal
    ADD CONSTRAINT personal_cedula_key UNIQUE (cedula);


--
-- Name: personal personal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal
    ADD CONSTRAINT personal_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_usuario_key UNIQUE (usuario);


--
-- Name: devoluciones devoluciones_detalle_entrega_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devoluciones
    ADD CONSTRAINT devoluciones_detalle_entrega_id_fkey FOREIGN KEY (detalle_entrega_id) REFERENCES public.detalle_entrega(id) ON DELETE CASCADE;


--
-- Name: detalle_entrega fk_detalle_entrega; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_entrega
    ADD CONSTRAINT fk_detalle_entrega FOREIGN KEY (entrega_id) REFERENCES public.entregas(id) ON DELETE CASCADE;


--
-- Name: detalle_entrega fk_detalle_inventario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_entrega
    ADD CONSTRAINT fk_detalle_inventario FOREIGN KEY (inventario_id) REFERENCES public.inventario(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: entregas fk_entrega_personal; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entregas
    ADD CONSTRAINT fk_entrega_personal FOREIGN KEY (cedula) REFERENCES public.personal(cedula) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: historial_cambios_inventario historial_cambios_inventario_inventario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_cambios_inventario
    ADD CONSTRAINT historial_cambios_inventario_inventario_id_fkey FOREIGN KEY (inventario_id) REFERENCES public.inventario(id) ON DELETE CASCADE;


--
-- Name: inventario_mal_estado inventario_mal_estado_devolucion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_mal_estado
    ADD CONSTRAINT inventario_mal_estado_devolucion_id_fkey FOREIGN KEY (devolucion_id) REFERENCES public.devoluciones(id) ON DELETE CASCADE;


--
-- Name: inventario_mal_estado inventario_mal_estado_entrega_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_mal_estado
    ADD CONSTRAINT inventario_mal_estado_entrega_id_fkey FOREIGN KEY (entrega_id) REFERENCES public.entregas(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict S2fOs1brkvgy8uZ0PMShdSMcqFHKhx00rLJat4TKKE8iXAQmKPd0WvI0oBjwLun

