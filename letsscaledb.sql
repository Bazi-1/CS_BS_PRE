-- Table: public.comment

-- DROP TABLE IF EXISTS public.comment;

CREATE TABLE IF NOT EXISTS public.comment
(
    comment_id integer NOT NULL DEFAULT nextval('comment_comment_id_seq'::regclass),
    user_id integer,
    course_id integer,
    comment text COLLATE pg_catalog."default",
    updated_at date
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.comment
    OWNER to postgres;


-- Table: public.contact

-- DROP TABLE IF EXISTS public.contact;

CREATE TABLE IF NOT EXISTS public.contact
(
    message_id integer NOT NULL DEFAULT nextval('contact_message_id_seq'::regclass),
    email character varying(50) COLLATE pg_catalog."default",
    subject character varying(50) COLLATE pg_catalog."default",
    message character varying(255) COLLATE pg_catalog."default",
    username character varying(50) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.contact
    OWNER to postgres;

-- Table: public.course

-- DROP TABLE IF EXISTS public.course;

CREATE TABLE IF NOT EXISTS public.course
(
    course_id integer NOT NULL DEFAULT nextval('course_course_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default",
    description character varying(255) COLLATE pg_catalog."default",
    instructor character varying(50) COLLATE pg_catalog."default",
    image character varying(55) COLLATE pg_catalog."default",
    user_id integer
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.course
    OWNER to postgres;

-- Table: public.enrollment

-- DROP TABLE IF EXISTS public.enrollment;

CREATE TABLE IF NOT EXISTS public.enrollment
(
    enroll_id integer NOT NULL DEFAULT nextval('enrollment_enroll_id_seq'::regclass),
    user_id integer NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(255) COLLATE pg_catalog."default" DEFAULT 'active'::character varying,
    course_id integer
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.enrollment
    OWNER to postgres;

-- Table: public.notes

-- DROP TABLE IF EXISTS public.notes;

CREATE TABLE IF NOT EXISTS public.notes
(
    note_id integer NOT NULL DEFAULT nextval('notes_note_id_seq'::regclass),
    title character varying COLLATE pg_catalog."default",
    content character varying COLLATE pg_catalog."default",
    user_id integer,
    session_id integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.notes
    OWNER to postgres;

-- Table: public.sections

-- DROP TABLE IF EXISTS public.sections;

CREATE TABLE IF NOT EXISTS public.sections
(
    section_id integer NOT NULL DEFAULT nextval('sections_section_id_seq'::regclass),
    title character varying(45) COLLATE pg_catalog."default",
    course_id integer,
    user_id integer
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.sections
    OWNER to postgres;

-- Table: public.session

-- DROP TABLE IF EXISTS public.session;

CREATE TABLE IF NOT EXISTS public.session
(
    session_id integer NOT NULL DEFAULT nextval('session_session_id_seq'::regclass),
    title character varying(55) COLLATE pg_catalog."default" DEFAULT false,
    user_id integer,
    course_id integer,
    section_id integer,
    completed boolean DEFAULT false
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.session
    OWNER to postgres;

-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
    username character varying(50) COLLATE pg_catalog."default",
    email character varying(50) COLLATE pg_catalog."default",
    password character(64) COLLATE pg_catalog."default",
    profilepic character varying(100) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

-- Table: public.video

-- DROP TABLE IF EXISTS public.video;

CREATE TABLE IF NOT EXISTS public.video
(
    video_id integer NOT NULL DEFAULT nextval('video_video_id_seq'::regclass),
    video_url character varying(255) COLLATE pg_catalog."default",
    session_id integer,
    duration interval
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.video
    OWNER to postgres;