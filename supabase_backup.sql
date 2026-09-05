--
-- PostgreSQL database dump
--

\restrict EHKPdXtx8WWvATqQafvjapRgq3SqpoaN8x7Eb5jLvGKteMuTLJHJnIw0FfcfZc6

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.4

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

ALTER TABLE IF EXISTS ONLY public.tables DROP CONSTRAINT IF EXISTS tables_current_session_id_fkey;
ALTER TABLE IF EXISTS ONLY public.table_sessions DROP CONSTRAINT IF EXISTS table_sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.table_sessions DROP CONSTRAINT IF EXISTS table_sessions_table_id_fkey;
ALTER TABLE IF EXISTS ONLY public.table_assignments DROP CONSTRAINT IF EXISTS table_assignments_waiter_id_fkey;
ALTER TABLE IF EXISTS ONLY public.table_assignments DROP CONSTRAINT IF EXISTS table_assignments_table_id_fkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.password_reset_tokens DROP CONSTRAINT IF EXISTS password_reset_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_table_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_session_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_bill_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_menu_item_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_item_modifiers DROP CONSTRAINT IF EXISTS order_item_modifiers_order_item_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_item_modifiers DROP CONSTRAINT IF EXISTS order_item_modifiers_modifier_option_id_fkey;
ALTER TABLE IF EXISTS ONLY public.modifier_options DROP CONSTRAINT IF EXISTS modifier_options_group_id_fkey;
ALTER TABLE IF EXISTS ONLY public.menu_items DROP CONSTRAINT IF EXISTS menu_items_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.menu_item_reviews DROP CONSTRAINT IF EXISTS menu_item_reviews_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.menu_item_reviews DROP CONSTRAINT IF EXISTS menu_item_reviews_menu_item_id_fkey;
ALTER TABLE IF EXISTS ONLY public.menu_item_photos DROP CONSTRAINT IF EXISTS menu_item_photos_menu_item_id_fkey;
ALTER TABLE IF EXISTS ONLY public.menu_item_modifier_groups DROP CONSTRAINT IF EXISTS menu_item_modifier_groups_menu_item_id_fkey;
ALTER TABLE IF EXISTS ONLY public.menu_item_modifier_groups DROP CONSTRAINT IF EXISTS menu_item_modifier_groups_group_id_fkey;
ALTER TABLE IF EXISTS ONLY public.email_verification_tokens DROP CONSTRAINT IF EXISTS email_verification_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_table_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_menu_item_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_cart_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bills DROP CONSTRAINT IF EXISTS bills_table_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bills DROP CONSTRAINT IF EXISTS bills_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.bill_requests DROP CONSTRAINT IF EXISTS bill_requests_table_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bill_requests DROP CONSTRAINT IF EXISTS bill_requests_session_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bill_requests DROP CONSTRAINT IF EXISTS bill_requests_handled_by_fkey;
DROP INDEX IF EXISTS public.idx_reviews_item;
DROP INDEX IF EXISTS public.idx_refresh_tokens_token;
DROP INDEX IF EXISTS public.idx_password_reset_tokens_user_id;
DROP INDEX IF EXISTS public.idx_password_reset_tokens_token_hash;
DROP INDEX IF EXISTS public.idx_modifier_options_group;
DROP INDEX IF EXISTS public.idx_menu_items_status;
DROP INDEX IF EXISTS public.idx_menu_items_category;
DROP INDEX IF EXISTS public.idx_menu_item_photos_item;
DROP INDEX IF EXISTS public.idx_menu_categories_status;
DROP INDEX IF EXISTS public.idx_email_verify_user;
DROP INDEX IF EXISTS public.idx_email_verify_tokenhash;
DROP INDEX IF EXISTS public.idx_coupons_code;
DROP INDEX IF EXISTS public.idx_coupons_active;
DROP INDEX IF EXISTS public.idx_bills_stripe_payment_intent_id;
DROP INDEX IF EXISTS public.idx_bill_requests_table;
DROP INDEX IF EXISTS public.idx_bill_requests_pending;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.tables DROP CONSTRAINT IF EXISTS tables_table_number_key;
ALTER TABLE IF EXISTS ONLY public.tables DROP CONSTRAINT IF EXISTS tables_pkey;
ALTER TABLE IF EXISTS ONLY public.table_sessions DROP CONSTRAINT IF EXISTS table_sessions_session_token_key;
ALTER TABLE IF EXISTS ONLY public.table_sessions DROP CONSTRAINT IF EXISTS table_sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.table_assignments DROP CONSTRAINT IF EXISTS table_assignments_pkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.password_reset_tokens DROP CONSTRAINT IF EXISTS password_reset_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.order_item_modifiers DROP CONSTRAINT IF EXISTS order_item_modifiers_pkey;
ALTER TABLE IF EXISTS ONLY public.modifier_options DROP CONSTRAINT IF EXISTS modifier_options_pkey;
ALTER TABLE IF EXISTS ONLY public.modifier_groups DROP CONSTRAINT IF EXISTS modifier_groups_pkey;
ALTER TABLE IF EXISTS ONLY public.menu_items DROP CONSTRAINT IF EXISTS menu_items_pkey;
ALTER TABLE IF EXISTS ONLY public.menu_item_reviews DROP CONSTRAINT IF EXISTS menu_item_reviews_pkey;
ALTER TABLE IF EXISTS ONLY public.menu_item_photos DROP CONSTRAINT IF EXISTS menu_item_photos_pkey;
ALTER TABLE IF EXISTS ONLY public.menu_item_modifier_groups DROP CONSTRAINT IF EXISTS menu_item_modifier_groups_pkey;
ALTER TABLE IF EXISTS ONLY public.menu_categories DROP CONSTRAINT IF EXISTS menu_categories_pkey;
ALTER TABLE IF EXISTS ONLY public.menu_categories DROP CONSTRAINT IF EXISTS menu_categories_name_key;
ALTER TABLE IF EXISTS ONLY public.email_verification_tokens DROP CONSTRAINT IF EXISTS email_verification_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.coupons DROP CONSTRAINT IF EXISTS coupons_pkey;
ALTER TABLE IF EXISTS ONLY public.coupons DROP CONSTRAINT IF EXISTS coupons_code_key;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_pkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_pkey;
ALTER TABLE IF EXISTS ONLY public.bills DROP CONSTRAINT IF EXISTS bills_pkey;
ALTER TABLE IF EXISTS ONLY public.bill_requests DROP CONSTRAINT IF EXISTS bill_requests_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.tables;
DROP TABLE IF EXISTS public.table_sessions;
DROP TABLE IF EXISTS public.table_assignments;
DROP TABLE IF EXISTS public.refresh_tokens;
DROP TABLE IF EXISTS public.password_reset_tokens;
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.order_items;
DROP TABLE IF EXISTS public.order_item_modifiers;
DROP TABLE IF EXISTS public.modifier_options;
DROP TABLE IF EXISTS public.modifier_groups;
DROP TABLE IF EXISTS public.menu_items;
DROP TABLE IF EXISTS public.menu_item_reviews;
DROP TABLE IF EXISTS public.menu_item_photos;
DROP TABLE IF EXISTS public.menu_item_modifier_groups;
DROP TABLE IF EXISTS public.menu_categories;
DROP TABLE IF EXISTS public.email_verification_tokens;
DROP TABLE IF EXISTS public.coupons;
DROP TABLE IF EXISTS public.carts;
DROP TABLE IF EXISTS public.cart_items;
DROP TABLE IF EXISTS public.bills;
DROP TABLE IF EXISTS public.bill_requests;
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bill_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bill_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    table_id uuid NOT NULL,
    session_id uuid,
    note text,
    status character varying(20) DEFAULT 'pending'::character varying,
    handled_by uuid,
    handled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT bill_requests_status_check CHECK (((status)::text = ANY (ARRAY[('pending'::character varying)::text, ('acknowledged'::character varying)::text, ('completed'::character varying)::text, ('rejected'::character varying)::text])))
);


ALTER TABLE public.bill_requests OWNER TO postgres;

--
-- Name: bills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bills (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    table_id uuid,
    subtotal numeric(12,2) NOT NULL,
    tax_amount numeric(12,2) DEFAULT 0,
    discount_type character varying(10),
    discount_value numeric(12,2) DEFAULT 0,
    total_amount numeric(12,2) NOT NULL,
    payment_method character varying(20),
    payment_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    stripe_payment_intent_id character varying(255),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT bills_discount_type_check CHECK (((discount_type)::text = ANY ((ARRAY['percent'::character varying, 'fixed'::character varying, 'none'::character varying])::text[])))
);


ALTER TABLE public.bills OWNER TO postgres;

--
-- Name: COLUMN bills.stripe_payment_intent_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.bills.stripe_payment_intent_id IS 'Stripe Payment Intent ID for online payments';


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cart_id uuid NOT NULL,
    menu_item_id uuid NOT NULL,
    quantity integer NOT NULL,
    note text,
    modifiers jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    table_id uuid,
    user_id uuid,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT carts_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'converted'::character varying, 'abandoned'::character varying])::text[])))
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- Name: coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    discount_type character varying(20) NOT NULL,
    discount_value numeric(10,2) NOT NULL,
    min_order_amount numeric(10,2) DEFAULT 0,
    max_discount_amount numeric(10,2),
    usage_limit integer,
    used_count integer DEFAULT 0,
    start_date timestamp with time zone DEFAULT now(),
    end_date timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT coupons_discount_type_check CHECK (((discount_type)::text = ANY ((ARRAY['percent'::character varying, 'fixed'::character varying])::text[])))
);


ALTER TABLE public.coupons OWNER TO postgres;

--
-- Name: email_verification_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_verification_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.email_verification_tokens OWNER TO postgres;

--
-- Name: menu_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    display_order integer DEFAULT 0,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false NOT NULL,
    CONSTRAINT menu_categories_display_order_check CHECK ((display_order >= 0)),
    CONSTRAINT menu_categories_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


ALTER TABLE public.menu_categories OWNER TO postgres;

--
-- Name: menu_item_modifier_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_item_modifier_groups (
    menu_item_id uuid NOT NULL,
    group_id uuid NOT NULL
);


ALTER TABLE public.menu_item_modifier_groups OWNER TO postgres;

--
-- Name: menu_item_photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_item_photos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    menu_item_id uuid NOT NULL,
    url text NOT NULL,
    is_primary boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.menu_item_photos OWNER TO postgres;

--
-- Name: menu_item_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_item_reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    menu_item_id uuid NOT NULL,
    rating integer NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT menu_item_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.menu_item_reviews OWNER TO postgres;

--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid NOT NULL,
    name character varying(80) NOT NULL,
    description text,
    price numeric(12,2) NOT NULL,
    prep_time_minutes integer DEFAULT 0,
    status character varying(20) NOT NULL,
    image_url text,
    is_chef_recommended boolean DEFAULT false,
    is_deleted boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT menu_items_prep_time_minutes_check CHECK (((prep_time_minutes >= 0) AND (prep_time_minutes <= 240))),
    CONSTRAINT menu_items_price_check CHECK ((price > (0)::numeric)),
    CONSTRAINT menu_items_status_check CHECK (((status)::text = ANY ((ARRAY['available'::character varying, 'unavailable'::character varying, 'sold_out'::character varying])::text[])))
);


ALTER TABLE public.menu_items OWNER TO postgres;

--
-- Name: modifier_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modifier_groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(80) NOT NULL,
    selection_type character varying(20) NOT NULL,
    is_required boolean DEFAULT false,
    min_selections integer DEFAULT 0,
    max_selections integer DEFAULT 0,
    display_order integer DEFAULT 0,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT modifier_groups_selection_type_check CHECK (((selection_type)::text = ANY ((ARRAY['single'::character varying, 'multiple'::character varying])::text[]))),
    CONSTRAINT modifier_groups_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


ALTER TABLE public.modifier_groups OWNER TO postgres;

--
-- Name: modifier_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modifier_options (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_id uuid NOT NULL,
    name character varying(80) NOT NULL,
    price_adjustment numeric(12,2) DEFAULT 0,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT modifier_options_price_adjustment_check CHECK ((price_adjustment >= (0)::numeric)),
    CONSTRAINT modifier_options_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


ALTER TABLE public.modifier_options OWNER TO postgres;

--
-- Name: order_item_modifiers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_item_modifiers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_item_id uuid NOT NULL,
    modifier_option_id uuid,
    modifier_name character varying(100) NOT NULL,
    price numeric(12,2) DEFAULT 0
);


ALTER TABLE public.order_item_modifiers OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    menu_item_id uuid,
    item_name character varying(100) NOT NULL,
    price numeric(12,2) NOT NULL,
    quantity integer NOT NULL,
    subtotal numeric(12,2) NOT NULL,
    note text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'received'::character varying,
    CONSTRAINT order_items_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT order_items_status_check CHECK (((status)::text = ANY (ARRAY[('received'::character varying)::text, ('rejected'::character varying)::text, ('preparing'::character varying)::text, ('ready'::character varying)::text, ('served'::character varying)::text])))
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    table_id uuid,
    user_id uuid,
    guest_name character varying(100),
    total_amount numeric(12,2) DEFAULT 0 NOT NULL,
    payment_status character varying(20) DEFAULT 'unpaid'::character varying,
    note text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    subtotal numeric(12,2) DEFAULT 0,
    tax_rate numeric(5,2) DEFAULT 0.10,
    tax_amount numeric(12,2) DEFAULT 0,
    discount_type character varying(10),
    discount_value numeric(12,2) DEFAULT 0,
    final_amount numeric(12,2) DEFAULT 0,
    payment_method character varying(20),
    bill_id uuid,
    session_id uuid,
    status character varying(20) DEFAULT 'received'::character varying,
    CONSTRAINT orders_discount_type_check CHECK (((discount_type)::text = ANY ((ARRAY['percent'::character varying, 'fixed'::character varying, 'none'::character varying])::text[]))),
    CONSTRAINT orders_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['cash'::character varying, 'card'::character varying, 'transfer'::character varying, 'other'::character varying])::text[]))),
    CONSTRAINT orders_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['unpaid'::character varying, 'paid'::character varying])::text[]))),
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['received'::character varying, 'preparing'::character varying, 'ready'::character varying, 'completed'::character varying, 'rejected'::character varying])::text[])))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoked boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: table_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.table_assignments (
    waiter_id uuid NOT NULL,
    table_id uuid NOT NULL,
    assigned_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.table_assignments OWNER TO postgres;

--
-- Name: table_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.table_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    table_id uuid NOT NULL,
    user_id uuid,
    session_token character varying(500) NOT NULL,
    started_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    ended_at timestamp with time zone,
    status character varying(20) DEFAULT 'active'::character varying,
    CONSTRAINT table_sessions_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'closed'::character varying])::text[])))
);


ALTER TABLE public.table_sessions OWNER TO postgres;

--
-- Name: tables; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tables (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    table_number character varying(50) NOT NULL,
    capacity integer NOT NULL,
    location character varying(100),
    description text,
    status character varying(20) DEFAULT 'active'::character varying,
    qr_token character varying(500),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    current_session_id uuid,
    CONSTRAINT tables_capacity_check CHECK (((capacity > 0) AND (capacity <= 20))),
    CONSTRAINT tables_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


ALTER TABLE public.tables OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'customer'::character varying,
    is_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    preferences text,
    avatar_url text,
    is_actived boolean DEFAULT true NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['superadmin'::character varying, 'admin'::character varying, 'waiter'::character varying, 'kitchen'::character varying, 'customer'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: bill_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bill_requests (id, table_id, session_id, note, status, handled_by, handled_at, created_at) FROM stdin;
764a128b-b011-4454-b3b5-ae461201a0ab	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	\N	2026-01-18 09:10:28.018824+00	2026-01-18 09:00:23.696+00
f75f12f9-525e-454e-80f7-abebc8dec906	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-18 09:10:28.018824+00	2026-01-17 20:56:42.77131+00
8d8d91ad-4585-44e8-a8cb-356cac3b558b	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 18:25:37.369956+00	2026-01-17 18:16:15.939503+00
348d5e80-2d31-4b4d-a4ac-04301848ab9f	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 18:25:37.369956+00	2026-01-17 18:19:22.153578+00
73a19b95-f7fb-4130-afc0-7b2b44eeab91	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 18:25:37.369956+00	2026-01-17 18:25:18.417503+00
144e5e3e-9b7e-45c1-aa65-677c6a64d71a	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 20:07:07.200497+00	2026-01-17 18:40:21.136112+00
cdd5419d-2c63-448b-95a4-7e50b2c47e68	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 20:07:07.200497+00	2026-01-17 18:40:41.011209+00
f1294162-2046-4c7f-aeba-12850a49bb63	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 20:07:07.200497+00	2026-01-17 18:41:32.465921+00
9a42fab5-c5e1-431c-953d-1a83b6d45b51	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 20:07:07.200497+00	2026-01-17 18:42:13.669816+00
e6e6dacd-0940-44d4-9598-59c7aaa74df4	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 20:07:07.200497+00	2026-01-17 18:44:02.143918+00
08bc9ec3-81e5-4a21-bcfa-9f35da845711	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 20:07:07.200497+00	2026-01-17 18:44:27.390035+00
a870e7e9-a69b-41fa-a7d0-e68fa7e3519b	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 20:07:07.200497+00	2026-01-17 19:35:30.429286+00
f8e60a85-3c89-4e94-863f-df437668a1fa	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 20:07:07.200497+00	2026-01-17 19:42:10.591576+00
7a20610d-ec74-410d-9075-53d0f3dce237	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-18 09:18:06.131167+00	2026-01-18 09:17:45.324395+00
7de5bef7-157f-4f10-a8f6-9ca9c9c4ccac	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	\N	2026-01-18 13:45:56.439889+00	2026-01-18 12:42:12.639265+00
50655efc-2712-4bf3-9aa6-75afdaad97f3	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	rejected	\N	2026-01-17 21:03:03.670567+00	2026-01-17 20:56:58.509875+00
4c012ce2-8b12-466c-8f99-b8d865630179	3675b800-1a92-435b-9c8b-4650c12896e3	\N	\N	rejected	\N	2026-01-17 21:03:04.449464+00	2026-01-17 21:00:25.618939+00
d68b3f11-3fa1-4614-924f-d590611bb369	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	rejected	\N	2026-01-17 18:13:34.398166+00	2026-01-17 18:13:13.304573+00
134441a8-5ffa-4660-b164-925c11cabdfa	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	rejected	\N	2026-01-17 18:15:32.613038+00	2026-01-17 18:15:19.851093+00
2353f99a-9f71-420b-bf44-3b6dee4a1770	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	rejected	\N	2026-01-18 09:16:41.992777+00	2026-01-18 09:12:08.192011+00
6b295bd4-7665-477d-9331-a107d46e04c5	76259a05-fee4-4af2-80e1-dd7487e2ceee	\N	\N	rejected	\N	2026-01-18 10:23:48.734497+00	2026-01-18 09:58:29.46045+00
b2991547-a2f4-451b-96a5-341906532f4c	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	rejected	\N	2026-01-18 10:23:49.91255+00	2026-01-18 10:11:23.505382+00
b91dd518-76f7-49ca-8a18-70211be232e7	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 20:07:07.200497+00	2026-01-17 19:42:59.5329+00
209f16c6-d598-4f4e-8b70-25865da5632b	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 20:07:07.200497+00	2026-01-17 19:46:01.397335+00
5067c010-f8b2-4a71-a834-65d6d45e4716	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 20:07:07.200497+00	2026-01-17 19:48:37.112603+00
b51cbee9-3700-46a8-890f-102075dbda2e	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 20:09:22.855839+00	2026-01-17 20:07:58.361654+00
12c98f4c-f0aa-4081-9750-c4ea1f65f5c6	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-17 20:12:34.978535+00	2026-01-17 20:12:09.351593+00
647741b8-7fa1-4860-8006-0cbc4ba871fd	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	rejected	\N	2026-01-18 17:44:23.299586+00	2026-01-18 17:37:56.43395+00
959b5c58-a7b4-4797-aaff-c292da41d9cc	76259a05-fee4-4af2-80e1-dd7487e2ceee	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-19 21:02:58.333317+00	2026-01-18 08:50:33.581809+00
4b44129d-3169-465b-a327-0393c0dd50e1	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-19 15:07:42.729898+00	2026-01-19 15:01:19.334688+00
933f7e41-e1bf-491d-ae73-a259f832a6ec	1c5f4293-df69-4528-9663-7c196c640e04	\N	\N	rejected	\N	2026-01-19 20:53:18.858617+00	2026-01-19 20:52:38.91996+00
7e318328-133b-4727-8898-b176d66ea089	1c5f4293-df69-4528-9663-7c196c640e04	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-19 20:56:59.254671+00	2026-01-19 20:51:29.593762+00
952eb447-34ca-43c6-a16b-e56928fcfd63	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	rejected	\N	2026-01-19 21:05:28.600777+00	2026-01-19 21:04:48.263302+00
07090b54-d8dc-4b76-8a3d-aed5bb35594d	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-19 21:16:07.252617+00	2026-01-19 21:06:22.796332+00
fc8d67a1-8386-41e2-b09f-51c269ce802b	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-19 23:53:18.034436+00	2026-01-19 23:50:16.56594+00
fff79173-d102-4cf3-8b10-bbed5eaa5ed9	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-19 21:58:12.727761+00	2026-01-19 21:57:49.228707+00
a8256c7f-a6a5-46c2-accf-617476fde160	24379309-fa06-4632-a43a-fec95ad013de	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-20 01:31:33.945476+00	2026-01-20 01:22:48.954262+00
629d8b5b-4b49-4740-a536-ae3e2dec6b8a	423ba70d-a275-454d-8a64-159ed6992733	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-20 08:07:12.316977+00	2026-01-20 08:05:39.19587+00
91eeb32d-f492-4a36-852d-dc98ef8e7d8b	423ba70d-a275-454d-8a64-159ed6992733	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-20 09:11:07.162063+00	2026-01-20 09:10:07.388851+00
9fd3293f-680c-4246-93fd-40ecb425c6e9	565c2cef-51e5-4964-b94e-603afe1170fa	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-20 09:30:12.335004+00	2026-01-20 09:28:30.101582+00
14eb4045-3a5e-4b32-9d93-7fa0805102f4	e77b38d9-4f8b-4793-9704-ebe6af343eab	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-20 10:57:35.853933+00	2026-01-20 10:57:07.731113+00
75107e2d-8293-42e6-b66d-d269c292c897	1c5f4293-df69-4528-9663-7c196c640e04	\N	\N	rejected	\N	2026-01-22 02:35:38.315107+00	2026-01-20 16:27:29.093973+00
4b936b9c-bb43-41b2-86e6-c569f8e86b8a	423ba70d-a275-454d-8a64-159ed6992733	\N	\N	completed	daa74fd2-afa3-408a-b50b-f1ffa476d608	2026-01-22 02:38:01.377701+00	2026-01-22 02:37:00.674415+00
\.


--
-- Data for Name: bills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bills (id, table_id, subtotal, tax_amount, discount_type, discount_value, total_amount, payment_method, payment_time, created_by, stripe_payment_intent_id, created_at) FROM stdin;
b8a41302-c29a-465c-8207-835414ff0348	e77b38d9-4f8b-4793-9704-ebe6af343eab	212.21	18.25	percent	14.00	200.75	cash	2026-01-14 09:39:06.904769+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
f4e00cca-df49-42c9-92af-56379eb0d7f9	e77b38d9-4f8b-4793-9704-ebe6af343eab	218.88	21.89	none	0.00	240.77	cash	2026-01-14 09:58:22.358114+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
e5a7ecb1-82e7-4935-bdc5-05cbcbb306cd	e77b38d9-4f8b-4793-9704-ebe6af343eab	130.67	13.07	none	0.00	143.74	cash	2026-01-14 12:01:06.624413+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
2b1729d4-db20-4952-aa73-4bb93e33f758	e77b38d9-4f8b-4793-9704-ebe6af343eab	99.95	10.00	none	0.00	109.95	cash	2026-01-14 12:01:52.498579+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
1e2e5bbd-20fc-4aa1-94f0-ffee985ab1ef	e77b38d9-4f8b-4793-9704-ebe6af343eab	46.50	4.65	none	0.00	51.15	cash	2026-01-14 12:04:09.159557+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
a47d5d20-63c7-4f8e-8bff-cba8ce8cf0ef	e77b38d9-4f8b-4793-9704-ebe6af343eab	46.91	4.69	none	0.00	51.60	cash	2026-01-14 12:05:26.861484+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
b684b0f8-4896-401d-acc2-e22bee1855af	e77b38d9-4f8b-4793-9704-ebe6af343eab	119.74	11.97	none	0.00	131.71	card	2026-01-14 14:29:30.032267+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
eba5857a-7b70-4b78-be4a-8d6e4f182d77	e77b38d9-4f8b-4793-9704-ebe6af343eab	76.95	7.70	none	0.00	84.65	transfer	2026-01-14 14:31:25.452967+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
686e333b-0ff9-4267-ba91-7e08455c2037	e77b38d9-4f8b-4793-9704-ebe6af343eab	39.25	3.93	none	0.00	43.18	cash	2026-01-14 15:49:17.260728+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
aff7539f-1dbc-4ac0-971d-7ce012aa9321	e77b38d9-4f8b-4793-9704-ebe6af343eab	69.95	6.99	none	0.00	76.95	cash	2026-01-14 17:42:18.364322+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
46f4c60a-2f89-49de-9c51-e63908a139fd	e77b38d9-4f8b-4793-9704-ebe6af343eab	282.86	28.29	none	0.00	311.15	cash	2026-01-15 11:05:46.673638+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
882bcee1-4706-4b1e-a1bf-57348d8d84bb	e77b38d9-4f8b-4793-9704-ebe6af343eab	112.50	11.25	none	0.00	123.75	transfer	2026-01-16 11:23:10.675584+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
7fdd1658-8e9b-4a01-bb47-559e4eadadda	e77b38d9-4f8b-4793-9704-ebe6af343eab	17.97	1.80	none	0.00	19.77	cash	2026-01-16 11:42:03.54276+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
99e90bd2-d94d-4a07-8ea3-4a569f747d7b	e77b38d9-4f8b-4793-9704-ebe6af343eab	171.46	17.15	none	0.00	188.61	cash	2026-01-17 03:02:07.177156+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
bc7b3768-7ef8-4a09-81cc-519be0f38e4a	e77b38d9-4f8b-4793-9704-ebe6af343eab	12.99	1.30	none	0.00	14.29	cash	2026-01-17 18:23:54.246162+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
9e8e964c-892e-4c9a-963f-68144a404ec6	e77b38d9-4f8b-4793-9704-ebe6af343eab	176.87	17.69	none	0.00	194.56	cash	2026-01-17 22:12:45.574943+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
b149c638-88d7-4f40-85b6-a992c1c50787	e77b38d9-4f8b-4793-9704-ebe6af343eab	109.43	10.94	none	0.00	120.37	cash	2026-01-17 23:50:53.061222+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
87515d2d-7181-4ab9-b37d-fde7ab9c1798	e77b38d9-4f8b-4793-9704-ebe6af343eab	5.99	0.60	none	0.00	6.59	cash	2026-01-18 00:09:28.059058+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
a593a9c7-dda9-455c-8cbc-c5ccc48dcb7e	e77b38d9-4f8b-4793-9704-ebe6af343eab	346.50	34.65	none	0.00	381.15	cash	2026-01-18 01:13:31.536304+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
99103100-2701-4de9-b662-fe011b96fcc2	e77b38d9-4f8b-4793-9704-ebe6af343eab	5.99	0.60	none	0.00	6.59	cash	2026-01-18 01:16:43.21574+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
e7a2c6a3-7278-40e0-b1ed-0b034003a321	e77b38d9-4f8b-4793-9704-ebe6af343eab	21.49	2.15	none	0.00	23.64	cash	2026-01-18 01:24:01.570669+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
5b6f9530-6201-47d6-83ed-d4ce61cce2eb	e77b38d9-4f8b-4793-9704-ebe6af343eab	5.99	0.60	none	0.00	6.59	cash	2026-01-18 01:25:36.851935+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
490f5919-5375-4d74-ba83-63c0750bafaa	e77b38d9-4f8b-4793-9704-ebe6af343eab	16.50	1.65	none	0.00	18.15	cash	2026-01-18 03:07:06.67449+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
be3681dd-cfff-4835-9e77-5cf0f260a8c3	e77b38d9-4f8b-4793-9704-ebe6af343eab	15.50	1.55	none	0.00	17.05	cash	2026-01-18 03:09:22.337844+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
af24b4bb-30d7-4f02-b7f6-5cdd9a55c7bf	e77b38d9-4f8b-4793-9704-ebe6af343eab	12.99	1.30	none	0.00	14.29	cash	2026-01-18 03:12:34.470526+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
5241674a-937a-445d-b0d8-a7faced6f9b3	e77b38d9-4f8b-4793-9704-ebe6af343eab	57.43	5.74	none	0.00	63.17	transfer	2026-01-18 16:10:27.237856+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
14478290-1ba6-44e7-98f2-830bef08d9a8	e77b38d9-4f8b-4793-9704-ebe6af343eab	77.46	7.75	none	0.00	85.21	cash	2026-01-18 16:18:05.433136+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
142420fe-ebc3-40e8-8e4a-0519060446c5	e77b38d9-4f8b-4793-9704-ebe6af343eab	55184.49	5518.45	none	0.00	60702.94	stripe	2026-01-18 20:45:55.708025+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	pi_3SqwHYJUCRWP7wIv0yUYmOz3	2026-01-19 21:34:53.566189+00
ec7b0187-7ec2-46a4-9df3-157fc2bfaf07	e77b38d9-4f8b-4793-9704-ebe6af343eab	72000000.00	7200000.00	none	0.00	79200000.00	stripe	2026-01-18 20:54:11.073453+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	pi_3SqwPOJUCRWP7wIv0hccCiXs	2026-01-19 21:34:53.566189+00
3c5c190e-a1f8-4003-8914-4dcadb99a93c	e77b38d9-4f8b-4793-9704-ebe6af343eab	119902.00	11990.20	none	0.00	131892.20	stripe	2026-01-18 21:25:50.513037+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	pi_3Sqwt9JUCRWP7wIv06FjVIp8	2026-01-19 21:34:53.566189+00
52a18b58-f6f3-42e3-acd4-b11f1369396b	e77b38d9-4f8b-4793-9704-ebe6af343eab	119902.00	11990.20	none	0.00	131892.20	stripe	2026-01-18 21:26:05.620625+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	pi_3Sqwu9JUCRWP7wIv0xcY2May	2026-01-19 21:34:53.566189+00
b17d6939-bb11-40c1-8cb4-15bdbd815390	e77b38d9-4f8b-4793-9704-ebe6af343eab	109900.00	10990.00	none	0.00	120890.00	stripe	2026-01-18 21:42:25.168812+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	pi_3Sqx8xJUCRWP7wIv07odXSlo	2026-01-19 21:34:53.566189+00
8c71915f-dcc4-4a72-9e56-7c6fa1dda93c	e77b38d9-4f8b-4793-9704-ebe6af343eab	229900.00	22990.00	none	0.00	252890.00	stripe	2026-01-18 21:46:19.670226+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	pi_3SqxDRJUCRWP7wIv1qTN0U7P	2026-01-19 21:34:53.566189+00
caa825f6-6723-4170-9fb4-bc79910c7b33	e77b38d9-4f8b-4793-9704-ebe6af343eab	109900.00	10990.00	none	0.00	120890.00	stripe	2026-01-18 21:49:21.31832+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	pi_3SqxG4JUCRWP7wIv0iQ8jNkm	2026-01-19 21:34:53.566189+00
41d7af64-639a-4756-bc30-a0d8718baaac	e77b38d9-4f8b-4793-9704-ebe6af343eab	1269500.00	126950.00	none	0.00	1396450.00	stripe	2026-01-19 01:20:02.857943+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	pi_3Sr0ZAJUCRWP7wIv1OmZvpzV	2026-01-19 21:34:53.566189+00
32d168f4-9c37-49c1-a773-e610cca40140	e77b38d9-4f8b-4793-9704-ebe6af343eab	3333300.00	333330.00	none	0.00	3666630.00	cash	2026-01-19 03:14:49.423618+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
c01dd394-7439-4aff-a5f4-0a44555086ce	e77b38d9-4f8b-4793-9704-ebe6af343eab	3792800.00	379280.00	none	0.00	4172080.00	card	2026-01-19 11:26:42.706383+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
837e042d-ab75-4c37-8bc5-d020c2cf1aaf	e77b38d9-4f8b-4793-9704-ebe6af343eab	1339900.00	133990.00	none	0.00	1473890.00	cash	2026-01-19 13:00:35.167097+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
71cc93d5-ab97-40d2-99e7-d0cbc686f4e4	e77b38d9-4f8b-4793-9704-ebe6af343eab	124500.00	12450.00	none	0.00	136950.00	cash	2026-01-19 14:24:07.87078+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
47d1799f-efe7-42f5-b278-da5854ef4f26	e77b38d9-4f8b-4793-9704-ebe6af343eab	219800.00	21980.00	none	0.00	241780.00	cash	2026-01-19 14:26:50.657152+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
1d48f957-5477-4228-bd43-28d2736bfe69	e77b38d9-4f8b-4793-9704-ebe6af343eab	209400.00	20940.00	none	0.00	230340.00	cash	2026-01-19 14:28:29.733146+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
b9e716d6-ad8a-46c3-a59a-d149c9eecf0f	e77b38d9-4f8b-4793-9704-ebe6af343eab	84900.00	8490.00	none	0.00	93390.00	cash	2026-01-19 14:34:52.598441+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
bee64f0a-cf3a-466f-bae3-9ad9a455ed43	e77b38d9-4f8b-4793-9704-ebe6af343eab	109900.00	10990.00	none	0.00	120890.00	cash	2026-01-19 14:39:40.575429+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
30b108ca-8b98-4ce3-998a-a41a3da379a9	e77b38d9-4f8b-4793-9704-ebe6af343eab	84900.00	8490.00	none	0.00	93390.00	cash	2026-01-19 14:42:34.438149+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
35c1b9ca-52ab-4b5a-9d24-f2e7253f8b7a	e77b38d9-4f8b-4793-9704-ebe6af343eab	124500.00	12450.00	none	0.00	136950.00	cash	2026-01-19 14:54:05.698324+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
c07b7182-cabe-45c0-9f86-71892147b913	e77b38d9-4f8b-4793-9704-ebe6af343eab	109900.00	10990.00	none	0.00	120890.00	cash	2026-01-19 14:56:24.991914+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
32cb812c-ad19-4d77-9201-a7e9941e5d69	e77b38d9-4f8b-4793-9704-ebe6af343eab	899900.00	89990.00	none	0.00	989890.00	cash	2026-01-19 15:05:04.308833+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
3bbc850a-52ee-4fc4-8cb6-ee5890a37c3a	e77b38d9-4f8b-4793-9704-ebe6af343eab	899900.00	89990.00	none	0.00	989890.00	cash	2026-01-19 15:10:19.381397+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
3bf9393f-7011-466d-84d9-9eff457499a9	e77b38d9-4f8b-4793-9704-ebe6af343eab	84900.00	8490.00	none	0.00	93390.00	cash	2026-01-19 15:14:31.577949+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
59526fc8-79ae-47d1-9fcf-4747676c5518	e77b38d9-4f8b-4793-9704-ebe6af343eab	309700.00	30970.00	none	0.00	340670.00	cash	2026-01-19 15:25:51.683646+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
d061297a-acee-414f-b801-2a4cb9fd7069	e77b38d9-4f8b-4793-9704-ebe6af343eab	304700.00	30470.00	none	0.00	335170.00	cash	2026-01-19 15:35:32.022529+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
073dd107-15ba-41d9-82ec-477a1b542f24	e77b38d9-4f8b-4793-9704-ebe6af343eab	304700.00	30470.00	none	0.00	335170.00	cash	2026-01-19 15:38:32.4526+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
49102555-f9d2-463f-bd8a-c8d46a09f96c	e77b38d9-4f8b-4793-9704-ebe6af343eab	109900.00	10990.00	none	0.00	120890.00	cash	2026-01-19 15:47:17.001048+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
87d9e7d9-e7af-4438-adb4-eae6479c91f8	e77b38d9-4f8b-4793-9704-ebe6af343eab	109900.00	10990.00	none	0.00	120890.00	cash	2026-01-19 15:49:37.493417+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
26499ce4-96cd-4d11-a680-860ddb443bd6	e77b38d9-4f8b-4793-9704-ebe6af343eab	123500.00	12350.00	none	0.00	135850.00	cash	2026-01-19 17:16:07.349853+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
e1880fe8-b6d8-4d3e-8084-f6e0fcf7cca2	e77b38d9-4f8b-4793-9704-ebe6af343eab	1024400.00	102440.00	none	0.00	1126840.00	cash	2026-01-19 17:17:27.327994+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
b035c3fb-d7d7-42fa-9e1d-c12bda372dc5	3675b800-1a92-435b-9c8b-4650c12896e3	84900.00	8490.00	none	0.00	93390.00	cash	2026-01-19 17:24:08.165992+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
2326841b-0d9c-4ab3-b661-e04e6867a6a9	e77b38d9-4f8b-4793-9704-ebe6af343eab	109900.00	10990.00	none	0.00	120890.00	cash	2026-01-19 17:27:31.222691+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
907d3240-e2e0-4f4f-bae2-105af511aceb	e77b38d9-4f8b-4793-9704-ebe6af343eab	996600.00	99660.00	none	0.00	1096260.00	cash	2026-01-19 17:37:31.142056+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
2c7c18ff-1f95-433b-9b1f-48f3ed929d20	e77b38d9-4f8b-4793-9704-ebe6af343eab	123500.00	12350.00	none	0.00	135850.00	cash	2026-01-19 17:39:01.045049+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
180842d1-17a4-49ec-a864-7d247a9d4d8b	e77b38d9-4f8b-4793-9704-ebe6af343eab	109900.00	10990.00	none	0.00	120890.00	cash	2026-01-19 17:46:15.8284+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
735e0269-b081-474a-ae07-3b629eabddb7	e77b38d9-4f8b-4793-9704-ebe6af343eab	232200.00	23220.00	none	0.00	255420.00	cash	2026-01-19 18:13:41.650789+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
cfe15dfc-a99a-4c5f-8f06-57d8c2c7975a	e77b38d9-4f8b-4793-9704-ebe6af343eab	247000.00	24700.00	none	0.00	271700.00	cash	2026-01-19 20:19:05.296687+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
3b685e39-8694-454a-98b2-b4dadff232ee	3675b800-1a92-435b-9c8b-4650c12896e3	5685800.00	568580.00	none	0.00	6254380.00	cash	2026-01-19 20:22:48.891587+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
cb9cd11a-8856-4a2c-b86c-39df60d06daa	e77b38d9-4f8b-4793-9704-ebe6af343eab	123500.00	12350.00	none	0.00	135850.00	cash	2026-01-19 21:42:30.328986+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
a071e2d5-311f-40aa-a1b2-a9b42a17bbc0	e77b38d9-4f8b-4793-9704-ebe6af343eab	1111500.00	111150.00	none	0.00	1222650.00	cash	2026-01-19 21:53:56.433415+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
b98ac967-cd48-4c31-b4c0-5a087fa4a52f	e77b38d9-4f8b-4793-9704-ebe6af343eab	124500.00	12450.00	none	0.00	136950.00	cash	2026-01-19 21:56:07.300271+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
c0e1e73b-e926-455c-8af8-47bd906a8f28	e77b38d9-4f8b-4793-9704-ebe6af343eab	1110000.00	111000.00	none	0.00	1221000.00	cash	2026-01-19 22:07:41.686926+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
381fd59d-acac-45a0-af6e-f89d06989750	e77b38d9-4f8b-4793-9704-ebe6af343eab	122300.00	12230.00	none	0.00	134530.00	cash	2026-01-19 22:09:45.394007+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
f0866343-2a2b-4c68-a869-b696deb85d20	e77b38d9-4f8b-4793-9704-ebe6af343eab	1111500.00	111150.00	none	0.00	1222650.00	cash	2026-01-19 22:11:22.259392+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
28ec3fb0-54f0-44e2-a883-e25005eae761	e77b38d9-4f8b-4793-9704-ebe6af343eab	457600.00	45760.00	none	0.00	503360.00	cash	2026-01-19 22:46:03.395017+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
5cab1bdf-971c-4956-bc48-7bc3ca5215af	24379309-fa06-4632-a43a-fec95ad013de	3630000.00	363000.00	none	0.00	3993000.00	cash	2026-01-20 00:11:37.849582+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
f447ec99-e8f1-4ba2-b624-4e8481ca876b	e77b38d9-4f8b-4793-9704-ebe6af343eab	1632500.00	163250.00	none	0.00	1795750.00	cash	2026-01-20 00:25:48.432663+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
9d75856f-07db-4c6d-a251-35ebd1f2c867	e77b38d9-4f8b-4793-9704-ebe6af343eab	6075000.00	607500.00	none	0.00	6682500.00	cash	2026-01-20 01:55:23.008209+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
5ed51cad-7949-4880-9adf-25d9a2d0046c	e77b38d9-4f8b-4793-9704-ebe6af343eab	1196400.00	119640.00	none	0.00	1316040.00	cash	2026-01-20 02:06:09.087835+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
452ab65d-31d6-4d65-bb24-f310ca4b53ce	e77b38d9-4f8b-4793-9704-ebe6af343eab	269900.00	26990.00	none	0.00	296890.00	cash	2026-01-20 02:14:06.786032+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
3d90e0bf-4848-4662-a150-8bd41aeb6714	e77b38d9-4f8b-4793-9704-ebe6af343eab	394400.00	39440.00	none	0.00	433840.00	cash	2026-01-20 02:29:51.053463+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
95dca5b2-1128-4c20-9010-07d7b4bc7946	e77b38d9-4f8b-4793-9704-ebe6af343eab	269900.00	26990.00	none	0.00	296890.00	cash	2026-01-20 02:35:06.927673+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
b49f0d0d-731a-4556-bf42-50173f8a4bd6	e77b38d9-4f8b-4793-9704-ebe6af343eab	169800.00	16980.00	none	0.00	186780.00	cash	2026-01-20 02:52:01.757537+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
b628d146-5316-4461-a3a4-075e40e415c5	e77b38d9-4f8b-4793-9704-ebe6af343eab	269900.00	26990.00	none	0.00	296890.00	cash	2026-01-20 03:18:42.525903+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
d2bfba60-270e-4a9f-b595-b4a78bf12086	1c5f4293-df69-4528-9663-7c196c640e04	238300.00	23830.00	none	0.00	262130.00	stripe	2026-01-20 03:56:58.934991+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	pi_3SrPSxJUCRWP7wIv040zlgR7	2026-01-19 21:34:53.566189+00
3983f960-088f-45eb-b7e0-4aaddbc81dec	e77b38d9-4f8b-4793-9704-ebe6af343eab	245800.00	24580.00	none	0.00	270380.00	cash	2026-01-20 03:57:39.905144+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
0699cd6f-74b9-4a41-9920-e6cc1e06fd9d	e77b38d9-4f8b-4793-9704-ebe6af343eab	243500.00	24350.00	none	0.00	267850.00	cash	2026-01-20 04:01:54.74078+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
b427f9bf-ab9c-4686-98fe-f76a530d3bc6	76259a05-fee4-4af2-80e1-dd7487e2ceee	269900.00	26990.00	none	0.00	296890.00	cash	2026-01-20 04:02:57.480962+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
392895f1-e046-49b1-8817-6a64dfe7130f	e77b38d9-4f8b-4793-9704-ebe6af343eab	284400.00	28440.00	none	0.00	312840.00	cash	2026-01-20 04:16:06.155998+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
ae11d6cf-16c7-46eb-9cc4-d6ca4b13e90c	e77b38d9-4f8b-4793-9704-ebe6af343eab	269900.00	26990.00	none	0.00	296890.00	cash	2026-01-20 04:19:27.720222+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
8685e982-0354-4315-a293-ba190a401e85	e77b38d9-4f8b-4793-9704-ebe6af343eab	539800.00	53980.00	none	0.00	593780.00	cash	2026-01-20 04:23:24.316461+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:34:53.566189+00
022b660d-66a9-4638-aa2b-76177669abc7	e77b38d9-4f8b-4793-9704-ebe6af343eab	1219900.00	121990.00	none	0.00	1341890.00	card	2026-01-19 21:52:08.791529+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:52:08.791529+00
d0220a9f-3507-4fac-ac4e-4c4b12fb71d4	e77b38d9-4f8b-4793-9704-ebe6af343eab	123500.00	12350.00	none	0.00	135850.00	cash	2026-01-19 21:54:52.354966+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:54:52.354966+00
bf6f3d7d-2de6-4605-8f16-9e583aaa5169	e77b38d9-4f8b-4793-9704-ebe6af343eab	122300.00	12230.00	none	0.00	134530.00	cash	2026-01-19 21:58:11.731871+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 21:58:11.731871+00
ecdcb498-b3c3-40b2-a870-c98e4e336786	e77b38d9-4f8b-4793-9704-ebe6af343eab	1888800.00	188880.00	none	0.00	2077680.00	card	2026-01-19 22:08:12.269875+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 22:08:12.269875+00
a0211c51-7475-47b3-ba3d-4f55068d28f5	e77b38d9-4f8b-4793-9704-ebe6af343eab	404600.00	40460.00	none	0.00	445060.00	cash	2026-01-19 22:14:27.22098+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 22:14:27.22098+00
9b7fd40c-6dda-4251-bc77-ea644a9eacca	e77b38d9-4f8b-4793-9704-ebe6af343eab	1119700.00	100773.00	percent	10.00	1108503.00	cash	2026-01-19 22:22:42.285555+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 22:22:42.285555+00
8df6b4c1-150d-4dfa-ac60-e8bdd9eb0045	e77b38d9-4f8b-4793-9704-ebe6af343eab	89900.00	8990.00	none	0.00	98890.00	cash	2026-01-19 22:42:06.017491+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 22:42:06.017491+00
4b42cd11-e2cb-4475-b9a5-7075a3b28073	e77b38d9-4f8b-4793-9704-ebe6af343eab	5877100.00	587710.00	none	0.00	6464810.00	stripe	2026-01-19 23:48:20.0235+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 23:48:20.0235+00
cc544f48-9c46-4afe-924f-26c3b03537ae	e77b38d9-4f8b-4793-9704-ebe6af343eab	189900.00	18990.00	none	0.00	208890.00	stripe	2026-01-19 23:53:17.156084+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-19 23:53:17.156084+00
0932582f-4eb6-45d2-9cbf-7a634292339e	e77b38d9-4f8b-4793-9704-ebe6af343eab	120000.00	12000.00	none	0.00	132000.00	stripe	2026-01-20 00:50:42.74088+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 00:50:42.74088+00
dc2304f2-e783-4446-8942-fa7fd6e96543	e77b38d9-4f8b-4793-9704-ebe6af343eab	233400.00	23340.00	none	0.00	256740.00	cash	2026-01-20 00:55:24.893824+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 00:55:24.893824+00
02ca5b9e-d9b7-4f7e-a169-b2767ab6c353	e77b38d9-4f8b-4793-9704-ebe6af343eab	327200.00	32720.00	none	0.00	359920.00	cash	2026-01-20 01:00:01.872653+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 01:00:01.872653+00
e3b600eb-11ad-4101-9888-57ee62aea96b	e77b38d9-4f8b-4793-9704-ebe6af343eab	1069000.00	106900.00	none	0.00	1175900.00	cash	2026-01-20 01:09:24.758803+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 01:09:24.758803+00
890712dc-7937-4497-8fa5-434ae60db3a1	e77b38d9-4f8b-4793-9704-ebe6af343eab	448600.00	44860.00	none	0.00	493460.00	cash	2026-01-20 01:23:32.873338+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 01:23:32.873338+00
25f6f59a-0bfb-4a35-ae31-ed0bee173a39	24379309-fa06-4632-a43a-fec95ad013de	109900.00	10990.00	none	0.00	120890.00	stripe	2026-01-20 01:31:33.090459+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 01:31:33.090459+00
25a35476-4479-40fa-830c-9133575cc195	e77b38d9-4f8b-4793-9704-ebe6af343eab	219800.00	19782.00	percent	10.00	217602.00	cash	2026-01-20 04:49:27.349748+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 04:49:27.349748+00
05f7448c-f7b2-45b9-886d-b657fd9d372d	423ba70d-a275-454d-8a64-159ed6992733	99900.00	9990.00	none	0.00	109890.00	stripe	2026-01-20 08:07:11.746499+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 08:07:11.746499+00
0e2b1b90-6fd3-4992-84e4-d35327c7bd9f	423ba70d-a275-454d-8a64-159ed6992733	229900.00	22990.00	none	0.00	252890.00	cash	2026-01-20 09:11:06.632233+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 09:11:06.632233+00
e979e936-885f-407f-9b80-0dae5c7f3e43	565c2cef-51e5-4964-b94e-603afe1170fa	61800.00	6180.00	none	0.00	67980.00	stripe	2026-01-20 09:30:11.762605+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 09:30:11.762605+00
15cac447-f58c-42db-9ec4-73908f2d071e	e77b38d9-4f8b-4793-9704-ebe6af343eab	119900.00	10791.00	percent	10.00	118701.00	cash	2026-01-20 10:46:44.531478+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 10:46:44.531478+00
4a6648fc-f9d5-42d1-a177-e6ee20737caa	e77b38d9-4f8b-4793-9704-ebe6af343eab	199800.00	17982.00	percent	10.00	197802.00	cash	2026-01-20 10:51:16.767928+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 10:51:16.767928+00
d924b9f9-52e0-4048-beae-6d4c72cd82f6	e77b38d9-4f8b-4793-9704-ebe6af343eab	122900.00	11061.00	percent	10.00	121671.00	cash	2026-01-20 10:54:25.343647+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 10:54:25.343647+00
90af97b4-d968-4f0b-ba7e-0013eba4f3c0	e77b38d9-4f8b-4793-9704-ebe6af343eab	389800.00	38980.00	none	0.00	428780.00	transfer	2026-01-20 10:57:34.742541+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 10:57:34.742541+00
417ba85a-0f43-4147-be96-a1558527a7ab	e77b38d9-4f8b-4793-9704-ebe6af343eab	257100.00	23139.00	percent	10.00	254529.00	cash	2026-01-20 11:04:24.774071+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 11:04:24.774071+00
dc2406d7-802d-4219-85bd-751af8d46517	e77b38d9-4f8b-4793-9704-ebe6af343eab	257300.00	25730.00	none	0.00	283030.00	cash	2026-01-20 11:12:25.992095+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 11:12:25.992095+00
11de343e-7c50-40d6-9f47-587eed0bb7a3	e77b38d9-4f8b-4793-9704-ebe6af343eab	199800.00	17982.00	percent	10.00	197802.00	cash	2026-01-20 11:29:47.913885+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 11:29:47.913885+00
68287ed7-84a9-4408-98c9-8b4a5d482c2b	e77b38d9-4f8b-4793-9704-ebe6af343eab	99900.00	9990.00	none	0.00	109890.00	cash	2026-01-20 11:47:13.86147+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 11:47:13.86147+00
e30ce2bc-3b26-42d3-9355-fd357b4a7b8e	e77b38d9-4f8b-4793-9704-ebe6af343eab	919900.00	82791.00	percent	10.00	910701.00	cash	2026-01-20 12:46:41.720275+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 12:46:41.720275+00
dd329956-1104-4d6c-9ad6-9d46a2631eec	e77b38d9-4f8b-4793-9704-ebe6af343eab	157400.00	14166.00	percent	10.00	155826.00	cash	2026-01-20 12:48:08.696776+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 12:48:08.696776+00
e50530ab-d7f3-4fe0-a51d-17078a09b6a7	e77b38d9-4f8b-4793-9704-ebe6af343eab	144400.00	14440.00	none	0.00	158840.00	cash	2026-01-20 13:20:05.130188+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 13:20:05.130188+00
dfb594a5-be61-4eeb-bdee-9889495a4868	e77b38d9-4f8b-4793-9704-ebe6af343eab	899900.00	89990.00	none	0.00	989890.00	cash	2026-01-20 13:59:41.752229+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-20 13:59:41.752229+00
66e9991a-fff8-4094-b156-44bebe47128c	e77b38d9-4f8b-4793-9704-ebe6af343eab	1319700.00	131970.00	none	0.00	1451670.00	stripe	2026-01-20 14:03:39.632756+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	pi_3SrfWYJUCRWP7wIv0XWHrJh2	2026-01-20 14:03:39.632756+00
369044e2-2bb5-4a4e-8a73-d8202c3a840e	423ba70d-a275-454d-8a64-159ed6992733	122900.00	11061.00	percent	10.00	121671.00	cash	2026-01-22 02:38:00.79972+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-22 02:38:00.79972+00
70aab8d7-aabd-40a7-8a4f-e676638ab351	3675b800-1a92-435b-9c8b-4650c12896e3	122400.00	12240.00	none	0.00	134640.00	stripe	2026-01-22 03:11:05.271597+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-22 03:11:05.271597+00
7eb77963-19f7-49dc-b54c-4eedfbc1963f	423ba70d-a275-454d-8a64-159ed6992733	189800.00	18980.00	fixed	0.00	208780.00	stripe	2026-01-22 04:00:40.018614+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-22 04:00:40.018614+00
ac3a7624-a1af-4f88-b898-2c76acdd1162	423ba70d-a275-454d-8a64-159ed6992733	189800.00	18980.00	fixed	0.00	208780.00	stripe	2026-01-22 04:00:40.611036+00	daa74fd2-afa3-408a-b50b-f1ffa476d608	\N	2026-01-22 04:00:40.611036+00
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, cart_id, menu_item_id, quantity, note, modifiers, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, table_id, user_id, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupons (id, code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, used_count, start_date, end_date, is_active, created_at, updated_at) FROM stdin;
6e5dc999-21ee-4b15-ac7c-daf02d376637	WELCOME10	Giảm 10% cho khách mới	percent	10.00	100000.00	50000.00	100	0	2026-01-20 04:47:51.697168+00	2026-02-19 04:47:51.697168+00	t	2026-01-20 04:47:51.697168+00	2026-01-20 04:47:51.697168+00
81f6ac13-55ff-4b99-81fe-ca77833fac42	SAVE50K	Giảm 50,000đ cho đơn từ 200k	fixed	50000.00	200000.00	\N	50	0	2026-01-20 04:47:51.697168+00	2026-02-04 04:47:51.697168+00	t	2026-01-20 04:47:51.697168+00	2026-01-20 04:47:51.697168+00
2fc501e4-4b4d-4503-9118-bdab4a02fd77	VIP20	Giảm 20% cho khách VIP	percent	20.00	500000.00	200000.00	\N	0	2026-01-20 04:47:51.697168+00	2026-03-21 04:47:51.697168+00	t	2026-01-20 04:47:51.697168+00	2026-01-20 04:47:51.697168+00
\.


--
-- Data for Name: email_verification_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_verification_tokens (id, user_id, token_hash, expires_at, created_at) FROM stdin;
f24c0cec-cb0b-4721-9aee-cfde91eff96a	dee3702b-0db6-42af-bcf0-34db44dfc55b	f629772768024d69d2f2e4926219dc74ad486ea6b13a30ac98364c342c682d2e	2026-01-20 10:16:56.188+00	2026-01-20 10:01:56.269195+00
426673e7-0646-4f44-a550-8a462e530484	3dea4017-0088-466c-a013-89a3461fca12	cbad1d6050aaa0d26c1d7e1de0264f5f364ff258e1c1386032dd41dd91e16662	2026-01-20 10:19:43.194+00	2026-01-20 10:04:43.283846+00
2f789e26-e88b-4455-a65a-d0b8f5e66db6	900a56df-1e7b-4d1e-854f-7d8bf34972af	b653b22147dac7bd1670ef4bdce0b6ae7699c7fbb29b98c3291a6152deb006fa	2026-01-20 10:20:58.791+00	2026-01-20 10:05:58.880771+00
623c6410-56af-4985-a339-d4ee30d8062b	21533cc1-5c8f-4da8-8f6e-21c1ea65e072	21cef607199ed4c30967ff3e9921c8abc8c8abd05c5a43df301f4629450f49a3	2026-01-20 10:38:54.499+00	2026-01-20 10:23:54.585144+00
d67c544b-5f0e-4c9e-a847-8a2799dcc31c	1bbf8dc9-556f-48ad-b009-cc3191e3257a	ecaf62e508d5376500456b80d33d25fd05d6370615684d6b18fabb8ecfccbdbe	2026-04-07 08:21:49.11+00	2026-04-07 08:06:49.46641+00
\.


--
-- Data for Name: menu_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_categories (id, name, description, display_order, status, created_at, updated_at, is_deleted) FROM stdin;
dbed90f2-ac46-46fe-9b97-4ca05269b1b3	Burgers	Bánh mì kẹp	3	active	2026-01-11 12:00:17.440503+00	2026-01-11 12:00:17.440503+00	f
15a66570-0f2d-413a-94e1-1349744f5547	Steaks	Bít tết	4	active	2026-01-11 12:00:17.440503+00	2026-01-11 12:00:17.440503+00	f
b3040edd-1db8-4757-8b87-04f242d0c73c	Pasta	Mì Ý	5	active	2026-01-11 12:00:17.440503+00	2026-01-11 12:00:17.440503+00	f
7f721f12-d55c-4fe8-a44b-e020e588e593	Seafood	Hải sản	6	active	2026-01-11 12:00:17.440503+00	2026-01-11 12:00:17.440503+00	f
66392460-bb3a-4f23-a0b9-f233b62edc0a	Pizza	Pizza	7	active	2026-01-11 12:00:17.440503+00	2026-01-11 12:00:17.440503+00	f
c7bb73ba-be89-41f4-a1d9-79dd2277a692	Desserts	Tráng miệng	8	active	2026-01-11 12:00:17.440503+00	2026-01-11 12:00:17.440503+00	f
d8cf3cb4-8b11-4e0b-8096-4cfbab2bc98d	Beverages	Đồ uống không cồn	9	active	2026-01-11 12:00:17.440503+00	2026-01-11 12:00:17.440503+00	f
951751c5-5d8c-46ae-8593-9c9dd6de03ae	Alcohol	Đồ uống có cồn	10	active	2026-01-11 12:00:17.440503+00	2026-01-11 12:00:17.440503+00	f
ef68275f-0366-4cd6-bab9-d3ab762336ba	Appetizers	Khai vị	1	active	2026-01-11 12:00:17.440503+00	2026-01-19 14:58:38.752708+00	f
7b288507-fa6b-49b9-bbb2-95bbe19a5a49	Salads	Salad	2	active	2026-01-11 12:00:17.440503+00	2026-01-20 10:31:26.861733+00	f
897ce30e-4f3c-4ebb-8778-029a8e9f975e	Fruits		0	active	2026-01-20 10:31:52.969021+00	2026-01-20 10:32:59.799105+00	t
\.


--
-- Data for Name: menu_item_modifier_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_item_modifier_groups (menu_item_id, group_id) FROM stdin;
8fd4aa9a-6fe7-4a37-b52a-4a2fc9dd3705	e7702df6-bf09-45eb-8b4e-ee9f719d71fd
8fd4aa9a-6fe7-4a37-b52a-4a2fc9dd3705	92a2fc64-5d06-400e-9c27-cc5176dfd13a
ecb412ba-ce0b-4787-99d5-620822bac81b	e7702df6-bf09-45eb-8b4e-ee9f719d71fd
ecb412ba-ce0b-4787-99d5-620822bac81b	92a2fc64-5d06-400e-9c27-cc5176dfd13a
662fb161-6610-4992-8348-ef91bc97574d	cf9d8a62-fb22-4fdd-823d-789fbbb0ab82
662fb161-6610-4992-8348-ef91bc97574d	b216d671-1c3b-493b-b60f-ae28686c8640
662fb161-6610-4992-8348-ef91bc97574d	01c3923b-864f-473b-b32d-d6a812185e73
29ec8bba-7530-4659-997b-efaf8b98644a	cf9d8a62-fb22-4fdd-823d-789fbbb0ab82
29ec8bba-7530-4659-997b-efaf8b98644a	b216d671-1c3b-493b-b60f-ae28686c8640
29ec8bba-7530-4659-997b-efaf8b98644a	01c3923b-864f-473b-b32d-d6a812185e73
ff562252-5ac0-406d-953f-1dfed2084ec0	cf9d8a62-fb22-4fdd-823d-789fbbb0ab82
ff562252-5ac0-406d-953f-1dfed2084ec0	b216d671-1c3b-493b-b60f-ae28686c8640
ff562252-5ac0-406d-953f-1dfed2084ec0	01c3923b-864f-473b-b32d-d6a812185e73
25dc18ca-7dad-43a4-874f-64cbb651e11c	dbacad5f-ba01-4192-a754-df335b6b3948
a8ce0307-1914-44bd-8a3b-1eb62a5becf1	e7702df6-bf09-45eb-8b4e-ee9f719d71fd
a8ce0307-1914-44bd-8a3b-1eb62a5becf1	f5e04d95-e517-455c-aecb-d716816dcc9d
3cb4fc31-ef51-4aaf-bff6-d313a20d2aaf	3f4b37d3-0e87-45f8-a731-39c94814797d
209e7cc8-a42f-4a54-9c62-8615058056ed	01c3923b-864f-473b-b32d-d6a812185e73
209e7cc8-a42f-4a54-9c62-8615058056ed	b216d671-1c3b-493b-b60f-ae28686c8640
209e7cc8-a42f-4a54-9c62-8615058056ed	cf9d8a62-fb22-4fdd-823d-789fbbb0ab82
373bb3bf-14da-4ee5-baa4-67d545452934	e7702df6-bf09-45eb-8b4e-ee9f719d71fd
13343453-19c6-4ed5-8774-1e38780372e4	e7702df6-bf09-45eb-8b4e-ee9f719d71fd
004372b5-993f-4dee-b576-eda36a87e5b4	3f4b37d3-0e87-45f8-a731-39c94814797d
004372b5-993f-4dee-b576-eda36a87e5b4	41a65414-5a50-41e3-adf0-040ce8380751
004372b5-993f-4dee-b576-eda36a87e5b4	e7702df6-bf09-45eb-8b4e-ee9f719d71fd
e2642bd4-5276-44f9-9545-9947396558a4	3d2951b2-0847-42c4-9ba8-d7e90a6c430c
e2642bd4-5276-44f9-9545-9947396558a4	e7702df6-bf09-45eb-8b4e-ee9f719d71fd
\.


--
-- Data for Name: menu_item_photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_item_photos (id, menu_item_id, url, is_primary, created_at) FROM stdin;
010d66f4-b3b8-4fd4-aef0-18cce322f141	b3667fab-87e6-4a4d-a0b1-56e44c90403e	https://media.istockphoto.com/id/1320359395/vi/anh/burger-th%E1%BB%8Bt-b%C3%B2-th%E1%BB%A7-c%C3%B4ng-ngon-mi%E1%BB%87ng-v%E1%BB%9Bi-jalapenos-ph%C3%B4-mai-th%E1%BB%8Bt-x%C3%B4ng-kh%C3%B3i-v%C3%A0-b%C3%A1nh-m%C3%AC-nguy%C3%AAn-h%E1%BA%A1t.jpg?s=2048x2048&w=is&k=20&c=27rMMT2KrCHSWhM5ZoVKnokNrUVNO_eD5sefz-BVEgE=	t	2026-01-18 12:06:00.010487+00
3d1aba18-ba58-4003-bfa1-0fab0c9a0f14	8c2b0a9f-780c-4414-8f63-99f8d143692a	https://images.unsplash.com/photo-1724352476668-6cbd99da2d6b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D	t	2026-01-18 12:06:00.010487+00
6cfdbd9f-3848-43ee-a79e-2ac5d606096a	69108de8-317a-4695-8a0e-ca311c1aa013	https://images.unsplash.com/photo-1762631882900-e3174bada2ed?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D	t	2026-01-18 12:06:00.010487+00
d95057da-8828-4613-a30c-b2b3655487c1	ab8654ab-04a5-4855-a494-c5edeb2914ea	https://images.unsplash.com/photo-1565192259022-0427b058f372?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D	t	2026-01-18 12:06:00.010487+00
d6b500f2-a637-4690-a440-5de55c8e5bab	e76a2235-04c1-40b7-80d1-110ebae8dc94	https://www.cookingclassy.com/wp-content/uploads/2018/12/spinach-artichoke-dip-13-768x1148.jpg	t	2026-01-18 12:06:00.010487+00
ae56cc04-b457-447d-8318-2ea315247c85	19f618cf-df19-4bd2-b8f6-7d228a7917f4	https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400	t	2026-01-18 12:06:00.010487+00
ab60b3c8-c058-44cc-81ad-fc43bd46489a	85898a7e-e33c-4a4c-949c-27aabc72e872	https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400	t	2026-01-18 12:06:00.010487+00
2a3360e7-cd2f-42c9-b682-95733508f8c2	26fc48b3-7881-431e-81ec-2fa13498dce6	https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400	t	2026-01-18 12:06:00.010487+00
9f0cf3bb-340e-4fcf-9544-c94682285a11	55980ec5-5d1d-4ec8-a934-7e00fdd8db05	https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400	t	2026-01-18 12:06:00.010487+00
c3379f95-b156-4c6a-8202-b56573a87b69	5f08526a-6d70-43d2-a243-c60ad45837aa	https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400	t	2026-01-18 12:06:00.010487+00
09c3fcd5-e0df-41bf-8bfa-8f1f965165bf	8a0f37d4-ff74-4aa7-936d-c43cc934e34c	https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=400	t	2026-01-18 12:06:00.010487+00
a9804aaf-aa59-4275-b1f5-0991867e710d	e3f8111a-f6bb-4d0c-84cd-8ff059332e2b	https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400	t	2026-01-18 12:06:00.010487+00
f6386f6f-2084-4f92-a31e-228db9a19aae	2b6d6b94-c8c1-4bc2-91d9-0bf0a442b39b	https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400	t	2026-01-18 12:06:00.010487+00
97771eb6-5905-4a91-ae2e-380b4b56de78	3cb4fc31-ef51-4aaf-bff6-d313a20d2aaf	https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400	t	2026-01-18 12:06:00.010487+00
f260c513-21bd-4aba-82e7-9e3f09a15572	a2a5b736-8308-4893-8c30-6b7a33c0bb22	https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400	t	2026-01-18 12:06:00.010487+00
c49f7b57-2830-4a86-9ea1-9233db82a5c4	809f6ac6-8eba-415d-a363-a6a111bb8f8b	https://images.unsplash.com/photo-1501595091296-3aa970afb3ff?w=400	t	2026-01-18 12:06:00.010487+00
ae981ff5-27ee-4cd7-8d8b-98424f45c9d5	00527a43-c862-43d5-af2f-f93afc8a6f06	https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400	t	2026-01-18 12:06:00.010487+00
e8cd1996-836b-4524-a699-17fb03e52c22	b39c68ef-6410-4c40-a06c-c1d419601f7a	https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400	t	2026-01-18 12:06:00.010487+00
89b79070-af5b-43a8-b0fc-5c2df429b1e0	02ab80c8-6f5b-46b0-b342-a1f9799de27a	https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400	t	2026-01-18 12:06:00.010487+00
cb61ea73-88e7-4ebf-9fa0-58bae3e8fed5	ed9a7bb6-083f-4d27-a9b3-eea5b1201956	https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400	t	2026-01-18 12:06:00.010487+00
d72ebe29-d655-4015-8047-94b0de16dca0	e2642bd4-5276-44f9-9545-9947396558a4	https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400	t	2026-01-18 12:06:00.010487+00
9464e359-0c2a-48cf-994a-df51b8b32ed0	f047d40a-0791-4c0b-a133-3b8954f16d8a	https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?w=400	t	2026-01-18 12:06:00.010487+00
a57c8122-8f50-4651-b6ad-b195a01968b2	66018a69-d675-4d48-8c7b-5495eaf3332c	https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400	t	2026-01-18 12:06:00.010487+00
df4812d1-4f9a-48c3-8228-287b891301ea	6b9e376b-d76a-4f6c-abc3-d909133e8258	https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400	t	2026-01-18 12:06:00.010487+00
b19d804b-e326-452e-b207-a68562f73777	b18befbb-a4d9-48d3-982e-54d644b79f18	https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400	t	2026-01-18 12:06:00.010487+00
8f27e2e4-c365-4871-bd66-36bd14d513eb	a8ce0307-1914-44bd-8a3b-1eb62a5becf1	https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400	t	2026-01-18 12:06:00.010487+00
7445bab6-fe53-4f85-8cf7-8325c48bdbfe	004372b5-993f-4dee-b576-eda36a87e5b4	https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400	t	2026-01-18 12:06:00.010487+00
752759c9-3182-48c6-8699-e686a5f1e9da	45b5c42c-842e-4b11-aed2-f32b8fefc06a	https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400	t	2026-01-18 12:06:00.010487+00
1665fabb-857f-457b-8ef4-835498385807	64a3c77f-a0f4-4009-83ae-a749c4ee4e45	https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400	t	2026-01-18 12:06:00.010487+00
bde73e8e-1f4e-473a-b7bf-71b909d97a77	2c7ff500-503a-47fa-9607-5f6ed6c398ba	https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400	t	2026-01-18 12:06:00.010487+00
1cf6d396-be6d-4b0b-bcfe-6e7fa0cc893b	bf751d63-10a5-466e-82b1-57571e4ad664	https://images.unsplash.com/photo-1558030006-450675393462?w=400	t	2026-01-18 12:06:00.010487+00
037904bc-6d80-4490-b79c-44c583615fb2	fb05e9e7-7197-487b-bb48-05bc2930bd1a	https://images.unsplash.com/photo-1544025162-d76694265947?w=400	t	2026-01-18 12:06:00.010487+00
431b4f81-5a52-41d6-b5ab-52406a9d5c4b	8fd4aa9a-6fe7-4a37-b52a-4a2fc9dd3705	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400	t	2026-01-18 12:06:00.010487+00
5e0b6058-54b0-4608-b6a1-8dbca950c734	ecb412ba-ce0b-4787-99d5-620822bac81b	https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400	t	2026-01-18 12:06:00.010487+00
27095cc1-c1bb-4bf5-af2f-05595e3271d1	549e3932-34b5-4971-a55f-103d0dfc0288	https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400	t	2026-01-18 12:06:00.010487+00
debbdca3-e043-4fd6-affa-a62cbcd85fa4	ee853870-5c57-4590-aa7f-ef99e73442cb	https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400	t	2026-01-18 12:06:00.010487+00
b06e08ca-3041-46ad-85bb-2a8a520d8101	73f79bfd-d582-42b1-9b3a-fe6dfed170ac	https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400	t	2026-01-18 12:06:00.010487+00
ad4ef5fa-f933-45e4-a5c1-93be69d6b09e	948cf923-52f9-4a37-92b0-2b9c2307e46e	https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400	t	2026-01-18 12:06:00.010487+00
ac9cf9c8-cbd6-4353-95ed-30062aea1d7d	deceeab5-af8c-4e51-961d-1c73942db26b	https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400	t	2026-01-18 12:06:00.010487+00
e42e108d-6924-4c91-8e5d-4857f04bc2ad	df8cce60-e8e6-4804-b34b-63f7b1e40cdf	https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400	t	2026-01-18 12:06:00.010487+00
8feb3e61-89ce-4b52-911f-f4d4520d62c0	ff562252-5ac0-406d-953f-1dfed2084ec0	https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400	t	2026-01-18 12:06:00.010487+00
eaa8bae8-78eb-4fda-8cda-6f003ebea942	7bf65842-1bcd-4cb9-825f-1e9dfc6913a1	https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400	t	2026-01-18 12:06:00.010487+00
81db286d-7995-42d6-a0b5-929d7226bc9f	662fb161-6610-4992-8348-ef91bc97574d	https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400	t	2026-01-18 12:06:00.010487+00
247312b7-9cde-4ca9-8be0-92f11b8dad8a	2934886f-eef3-4146-8e4a-87e2f04bed59	https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400	t	2026-01-18 12:06:00.010487+00
611dc7a9-162f-4951-b808-cdb79f3fdf51	6889e8fc-f890-4a71-8da6-aef9a810b2a1	https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400	t	2026-01-18 12:06:00.010487+00
475e087e-6bb6-4d97-9328-b8b6874bc50f	b08151cc-b42c-4d76-84a0-38d7498d2e2a	https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=400	t	2026-01-18 12:06:00.010487+00
39f8ea3e-2a26-444b-8d3b-5e1d35693453	08d65568-0e8e-4c1a-bbd7-bf38e5a55b58	https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=400	t	2026-01-18 12:06:00.010487+00
d0b4857d-24eb-4f03-a7c0-0484c93544ef	46fea528-00d0-4b1b-b4d4-3555826fc82e	https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400	t	2026-01-18 12:06:00.010487+00
fb2a8f49-e657-4070-8958-91b5605d9b9e	209e7cc8-a42f-4a54-9c62-8615058056ed	https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400	t	2026-01-18 12:06:00.010487+00
84d8ca02-2f84-48a3-bd92-a23b42d2ecc9	29ec8bba-7530-4659-997b-efaf8b98644a	https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400	t	2026-01-18 12:06:00.010487+00
ae3e1a71-2f80-4d6b-bd49-f81baf761496	373bb3bf-14da-4ee5-baa4-67d545452934	https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400	t	2026-01-18 12:06:00.010487+00
9e961b23-51d2-4443-b50c-aa19d4cafc08	13343453-19c6-4ed5-8774-1e38780372e4	https://res.cloudinary.com/ddmp7so4t/image/upload/v1768905012/smart-restaurant-menu/menu-item-1768905010367-724507796.jpg	f	2026-01-20 10:30:13.815401+00
ebe1f6f3-75fa-4194-8a33-eba9f62b0ef8	13343453-19c6-4ed5-8774-1e38780372e4	https://res.cloudinary.com/ddmp7so4t/image/upload/v1768905036/smart-restaurant-menu/menu-item-1768905034188-315542025.jpg	t	2026-01-20 10:30:37.917162+00
473b4b61-049c-4d9e-84d5-a11d22b457b4	6b9e376b-d76a-4f6c-abc3-d909133e8258	https://res.cloudinary.com/ddmp7so4t/image/upload/v1768917294/smart-restaurant-menu/menu-item-1768917292367-237125898.jpg	f	2026-01-20 13:54:55.086608+00
231e2e1c-0896-474d-8c1f-7662d4ebe6e0	25dc18ca-7dad-43a4-874f-64cbb651e11c	https://media.istockphoto.com/id/616010748/vi/anh/mojito.jpg?s=2048x2048&w=is&k=20&c=LfNn1Y108H_htpYVDbTH8LnqpIVsLExcLgginOMhwfM=	t	2026-01-18 12:06:00.010487+00
4356c6f5-ae45-4183-8b8c-6f7a3dd82b4f	ea558179-9e92-47d7-9f97-b999a784d6a6	https://plus.unsplash.com/premium_photo-1671088575920-09f2a5970574?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aWNlZCUyMGNvZmZlZXxlbnwwfHwwfHx8MA%3D%3D	t	2026-01-18 12:06:00.010487+00
ae2eb564-5b92-441b-8194-d623824ee5fa	b9d16f3c-0856-46dc-9ee0-19e42f58ab1b	https://plus.unsplash.com/premium_photo-1695658864441-ad11e5afad29?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D	t	2026-01-18 12:06:00.010487+00
\.


--
-- Data for Name: menu_item_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_item_reviews (id, user_id, menu_item_id, rating, comment, created_at) FROM stdin;
eb1b4f83-f47b-471a-ae87-e0052d62a272	637ad6c2-4ebe-4a34-9dee-4069973bf704	19f618cf-df19-4bd2-b8f6-7d228a7917f4	3	Đánh giá test tự động #16	2026-01-19 18:17:37.679266+00
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_items (id, category_id, name, description, price, prep_time_minutes, status, image_url, is_chef_recommended, is_deleted, created_at, updated_at) FROM stdin;
19f618cf-df19-4bd2-b8f6-7d228a7917f4	ef68275f-0366-4cd6-bab9-d3ab762336ba	Buffalo Wings	Cánh gà chiên giòn sốt cay Buffalo kèm sốt phô mai xanh.	129900.00	0	available	https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
85898a7e-e33c-4a4c-949c-27aabc72e872	dbed90f2-ac46-46fe-9b97-4ca05269b1b3	Mushroom Swiss	Nấm xào bơ tỏi và phô mai Swiss tan chảy.	149900.00	0	available	https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
b3667fab-87e6-4a4d-a0b1-56e44c90403e	dbed90f2-ac46-46fe-9b97-4ca05269b1b3	Spicy Jalapeño Burger	Burger kẹp ớt Jalapeño cay nồng và sốt chipotle.	159900.00	0	available	https://images.unsplash.com/photo-1619250906756-324d081b203c?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
26fc48b3-7881-431e-81ec-2fa13498dce6	15a66570-0f2d-413a-94e1-1349744f5547	Ribeye Steak	Thăn lưng bò 12oz nướng, vân mỡ hoàn hảo.	329900.00	0	available	https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
55980ec5-5d1d-4ec8-a934-7e00fdd8db05	15a66570-0f2d-413a-94e1-1349744f5547	Filet Mignon	Thăn nội bò 8oz siêu mềm với bơ thảo mộc.	389900.00	0	available	https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
5f08526a-6d70-43d2-a243-c60ad45837aa	b3040edd-1db8-4757-8b87-04f242d0c73c	Fettuccine Alfredo	Sốt kem phô mai Parmesan béo ngậy.	169900.00	0	available	https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
8a0f37d4-ff74-4aa7-936d-c43cc934e34c	b3040edd-1db8-4757-8b87-04f242d0c73c	Spaghetti Bolognese	Mì Ý sốt bò băm cà chua truyền thống.	159900.00	0	available	https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
e3f8111a-f6bb-4d0c-84cd-8ff059332e2b	b3040edd-1db8-4757-8b87-04f242d0c73c	Carbonara	Sốt trứng, phô mai Pecorino và thịt heo muối Guanciale.	174900.00	0	available	https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
2b6d6b94-c8c1-4bc2-91d9-0bf0a442b39b	b3040edd-1db8-4757-8b87-04f242d0c73c	Lasagna	Mì lá nướng lớp với sốt thịt bò và phô mai Mozzarella.	189900.00	0	available	https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
3cb4fc31-ef51-4aaf-bff6-d313a20d2aaf	7f721f12-d55c-4fe8-a44b-e020e588e593	Grilled Salmon	Cá hồi Atlantic nướng sốt bơ chanh.	249900.00	0	available	https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
ab8654ab-04a5-4855-a494-c5edeb2914ea	7f721f12-d55c-4fe8-a44b-e020e588e593	Fish and Chips	Cá Tuyết tẩm bia chiên giòn kèm khoai tây chiên.	169900.00	0	available	https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
fb05e9e7-7197-487b-bb48-05bc2930bd1a	15a66570-0f2d-413a-94e1-1349744f5547	Tomahawk Ribeye	Bò Tomahawk khổng lồ dành cho 2 người ăn.	899900.00	0	available	https://images.unsplash.com/photo-1544025162-d76694265947?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-01-20 09:17:11.903801+00
a2a5b736-8308-4893-8c30-6b7a33c0bb22	7f721f12-d55c-4fe8-a44b-e020e588e593	Lobster Tail	Đuôi tôm hùm Maine hấp bơ tỏi.	399900.00	0	available	https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
809f6ac6-8eba-415d-a363-a6a111bb8f8b	7f721f12-d55c-4fe8-a44b-e020e588e593	Seared Tuna Steak	Cá ngừ đại dương áp chảo tái với vừng.	269900.00	0	available	https://images.unsplash.com/photo-1501595091296-3aa970afb3ff?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
00527a43-c862-43d5-af2f-f93afc8a6f06	ef68275f-0366-4cd6-bab9-d3ab762336ba	Crispy Calamari	Mực vòng tẩm bột chiên giòn với sốt Tartar chanh.	139900.00	0	available	https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-12 07:58:42.932745+00
b39c68ef-6410-4c40-a06c-c1d419601f7a	ef68275f-0366-4cd6-bab9-d3ab762336ba	Garlic Butter Shrimp	Tôm áp chảo sốt bơ tỏi và thảo mộc thơm lừng.	149900.00	0	available	https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-12 08:06:24.963985+00
02ab80c8-6f5b-46b0-b342-a1f9799de27a	b3040edd-1db8-4757-8b87-04f242d0c73c	Seafood Marinara	Mì Ý hải sản với tôm, mực, vẹm xanh sốt cà chua.	219900.00	0	available	https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-12 07:58:41.627922+00
ed9a7bb6-083f-4d27-a9b3-eea5b1201956	7b288507-fa6b-49b9-bbb2-95bbe19a5a49	Cobb Salad	Gà nướng, bơ, trứng luộc, thịt xông khói và phô mai xanh.	139900.00	0	available	https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-01-12 08:08:56.006446+00
e76a2235-04c1-40b7-80d1-110ebae8dc94	ef68275f-0366-4cd6-bab9-d3ab762336ba	Spinach Artichoke Dip	Sốt kem rau chân vịt và atiso nóng hổi kèm bánh mì nướng.	109900.00	0	available	https://images.unsplash.com/photo-1576515652031-fc429bab6503?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-01-12 07:58:49.038617+00
69108de8-317a-4695-8a0e-ca311c1aa013	7f721f12-d55c-4fe8-a44b-e020e588e593	Shrimp Scampi	Tôm sốt bơ tỏi chanh ăn kèm bánh mì.	229900.00	0	available	https://images.unsplash.com/photo-1624823180482-1e699b6416e9?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-01-12 07:59:27.024254+00
f047d40a-0791-4c0b-a133-3b8954f16d8a	b3040edd-1db8-4757-8b87-04f242d0c73c	Pesto Penne	Nui Penne sốt húng tây hạt thông và gà nướng.	164900.00	0	available	https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-01-12 07:59:35.918564+00
66018a69-d675-4d48-8c7b-5495eaf3332c	ef68275f-0366-4cd6-bab9-d3ab762336ba	Bruschetta	Bánh mì nướng kiểu Ý với cà chua tươi, húng quế và dầu ô liu.	89900.00	0	available	https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-12 08:04:30.815549+00
6b9e376b-d76a-4f6c-abc3-d909133e8258	ef68275f-0366-4cd6-bab9-d3ab762336ba	Mozzarella Sticks	Phô mai que chiên giòn tan, ăn kèm sốt Marinara.	99900.00	0	available	https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-12 08:06:19.682029+00
a8ce0307-1914-44bd-8a3b-1eb62a5becf1	7b288507-fa6b-49b9-bbb2-95bbe19a5a49	Greek Salad	Dưa leo, cà chua, ô liu Kalamata và phô mai Feta.	119900.00	0	available	https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-01-12 08:05:53.774176+00
8c2b0a9f-780c-4414-8f63-99f8d143692a	dbed90f2-ac46-46fe-9b97-4ca05269b1b3	Bacon Burger	Burger bò đúp thịt với thịt xông khói giòn rụm.	154900.00	0	available	https://images.unsplash.com/photo-1553979459-d2229ba7433b7433b?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-01-12 08:09:01.083401+00
45b5c42c-842e-4b11-aed2-f32b8fefc06a	7b288507-fa6b-49b9-bbb2-95bbe19a5a49	Quinoa Avocado Salad	Hạt diêm mạch, bơ tươi, rau rocket và sốt chanh.	129900.00	0	available	https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-01-12 08:09:02.334387+00
64a3c77f-a0f4-4009-83ae-a749c4ee4e45	dbed90f2-ac46-46fe-9b97-4ca05269b1b3	Classic Cheeseburger	Bò Mỹ nướng lửa, phô mai Cheddar, rau xà lách, cà chua.	139900.00	0	available	https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-01-12 08:09:02.782541+00
2c7ff500-503a-47fa-9607-5f6ed6c398ba	dbed90f2-ac46-46fe-9b97-4ca05269b1b3	Veggie Burger	Nhân thực vật nướng, bơ và rau mầm (Chay).	129900.00	0	available	https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-01-12 08:09:12.653673+00
bf751d63-10a5-466e-82b1-57571e4ad664	15a66570-0f2d-413a-94e1-1349744f5547	T-Bone Steak	Sự kết hợp hoàn hảo giữa thăn nội và thăn ngoại.	359900.00	0	available	https://images.unsplash.com/photo-1558030006-450675393462?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-01-12 08:09:26.823451+00
8fd4aa9a-6fe7-4a37-b52a-4a2fc9dd3705	66392460-bb3a-4f23-a0b9-f233b62edc0a	Margherita Pizza	Cà chua San Marzano, phô mai Mozzarella, húng quế.	149900.00	0	available	https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
ecb412ba-ce0b-4787-99d5-620822bac81b	66392460-bb3a-4f23-a0b9-f233b62edc0a	Pepperoni Pizza	Pizza xúc xích cay Pepperoni truyền thống.	164900.00	0	available	https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
004372b5-993f-4dee-b576-eda36a87e5b4	dbed90f2-ac46-46fe-9b97-4ca05269b1b3	BBQ Burger	Sốt BBQ khói, hành tây chiên giòn và phô mai Mỹ.	149900.00	0	available	https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-01-20 10:34:18.72774+00
b18befbb-a4d9-48d3-982e-54d644b79f18	7b288507-fa6b-49b9-bbb2-95bbe19a5a49	Caesar Salad	Xà lách Romaine, bánh mì nướng croutons, phô mai Parmesan.	129000.00	0	available	https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-04-28 05:50:08.026162+00
e2642bd4-5276-44f9-9545-9947396558a4	ef68275f-0366-4cd6-bab9-d3ab762336ba	Loaded Nachos	Bánh Tortilla phủ phô mai nóng chảy, ớt Jalapeños và bò băm.	150000.00	0	available	https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-04-28 05:52:50.770599+00
549e3932-34b5-4971-a55f-103d0dfc0288	66392460-bb3a-4f23-a0b9-f233b62edc0a	BBQ Chicken Pizza	Gà nướng, hành tím, ngò rí và sốt BBQ.	179900.00	0	available	https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
ee853870-5c57-4590-aa7f-ef99e73442cb	66392460-bb3a-4f23-a0b9-f233b62edc0a	Hawaiian Pizza	Thịt nguội, dứa tươi và phô mai.	169900.00	0	available	https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
73f79bfd-d582-42b1-9b3a-fe6dfed170ac	66392460-bb3a-4f23-a0b9-f233b62edc0a	Four Cheese Pizza	Mozzarella, Gorgonzola, Parmesan và Provolone.	159900.00	0	available	https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
948cf923-52f9-4a37-92b0-2b9c2307e46e	c7bb73ba-be89-41f4-a1d9-79dd2277a692	NY Cheesecake	Bánh phô mai kiểu New York kèm sốt dâu.	89900.00	0	available	https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
deceeab5-af8c-4e51-961d-1c73942db26b	c7bb73ba-be89-41f4-a1d9-79dd2277a692	Chocolate Lava Cake	Bánh sô-cô-la nóng chảy nhân ăn kèm kem vani.	94900.00	0	available	https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
ff562252-5ac0-406d-953f-1dfed2084ec0	d8cf3cb4-8b11-4e0b-8096-4cfbab2bc98d	Fresh Lemonade	Nước chanh tươi pha thủ công.	39900.00	0	available	https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
ea558179-9e92-47d7-9f97-b999a784d6a6	d8cf3cb4-8b11-4e0b-8096-4cfbab2bc98d	Iced Coffee	Cà phê đá xay ủ lạnh.	44900.00	0	available	https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
7bf65842-1bcd-4cb9-825f-1e9dfc6913a1	d8cf3cb4-8b11-4e0b-8096-4cfbab2bc98d	Mango Smoothie	Sinh tố xoài nhiệt đới.	59900.00	0	available	https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
662fb161-6610-4992-8348-ef91bc97574d	d8cf3cb4-8b11-4e0b-8096-4cfbab2bc98d	Iced Tea	Trà chanh sả đá lạnh.	29900.00	0	available	https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
b9d16f3c-0856-46dc-9ee0-19e42f58ab1b	951751c5-5d8c-46ae-8593-9c9dd6de03ae	Craft Beer	Bia thủ công IPA hương cam chanh.	69900.00	0	available	https://images.unsplash.com/photo-1586993451228-0971cd963ddc?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
25dc18ca-7dad-43a4-874f-64cbb651e11c	951751c5-5d8c-46ae-8593-9c9dd6de03ae	Classic Mojito	Rum, bạc hà, chanh tươi và soda.	99900.00	0	available	https://images.unsplash.com/photo-1551538827-9c037cb485da?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
6889e8fc-f890-4a71-8da6-aef9a810b2a1	951751c5-5d8c-46ae-8593-9c9dd6de03ae	Margarita	Tequila, rượu cam Cointreau và muối viền.	109900.00	0	available	https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
b08151cc-b42c-4d76-84a0-38d7498d2e2a	951751c5-5d8c-46ae-8593-9c9dd6de03ae	Old Fashioned	Whiskey Bourbon, đường nâu và vỏ cam.	129900.00	0	available	https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-11 12:00:45.293925+00
08d65568-0e8e-4c1a-bbd7-bf38e5a55b58	15a66570-0f2d-413a-94e1-1349744f5547	New York Strip	Thăn ngoại bò nướng tiêu đen đậm đà.	299900.00	0	available	https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-12 07:58:43.987652+00
46fea528-00d0-4b1b-b4d4-3555826fc82e	c7bb73ba-be89-41f4-a1d9-79dd2277a692	Tiramisu	Bánh tráng miệng Ý hương cà phê và rượu Rum.	89900.00	0	available	https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-01-12 08:09:25.103515+00
29ec8bba-7530-4659-997b-efaf8b98644a	d8cf3cb4-8b11-4e0b-8096-4cfbab2bc98d	Strawberry Milkshake	Sữa lắc kem dâu tây tươi.	59900.00	0	available	https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-12 08:45:17.873019+00
2934886f-eef3-4146-8e4a-87e2f04bed59	951751c5-5d8c-46ae-8593-9c9dd6de03ae	House Red Wine	Rượu vang đỏ Cabernet Sauvignon (Ly).	89900.00	0	unavailable	https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-20 09:16:18.766646+00
df8cce60-e8e6-4804-b34b-63f7b1e40cdf	c7bb73ba-be89-41f4-a1d9-79dd2277a692	Brownie Sundae	Brownie hạt óc chó, kem tươi và sốt sô-cô-la.	84900.00	0	unavailable	https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400	f	f	2026-01-11 12:00:45.293925+00	2026-01-20 09:17:23.411239+00
209e7cc8-a42f-4a54-9c62-8615058056ed	d8cf3cb4-8b11-4e0b-8096-4cfbab2bc98d	Coca Cola	Nước ngọt có ga.	29900.00	0	available	https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-01-20 02:29:24.794545+00
373bb3bf-14da-4ee5-baa4-67d545452934	c7bb73ba-be89-41f4-a1d9-79dd2277a692	Apple Pie	Bánh táo nướng quế truyền thống Mỹ.	79900.00	0	sold_out	https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400	t	f	2026-01-11 12:00:45.293925+00	2026-01-20 09:17:30.548966+00
13343453-19c6-4ed5-8774-1e38780372e4	15a66570-0f2d-413a-94e1-1349744f5547	Steak	\N	150000.00	15	available	\N	t	t	2026-01-20 10:30:08.664874+00	2026-01-20 10:30:50.440907+00
\.


--
-- Data for Name: modifier_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modifier_groups (id, name, selection_type, is_required, min_selections, max_selections, display_order, status, created_at, updated_at) FROM stdin;
dbacad5f-ba01-4192-a754-df335b6b3948	Alcohol Options	single	f	0	1	2	active	2026-01-12 15:48:10.077851+00	2026-01-12 15:48:10.077851+00
cf9d8a62-fb22-4fdd-823d-789fbbb0ab82	Drink Size	single	t	1	1	1	active	2026-01-12 15:48:10.077851+00	2026-01-12 15:48:10.077851+00
3d2951b2-0847-42c4-9ba8-d7e90a6c430c	Nachos Extras	multiple	f	0	4	2	active	2026-01-12 15:48:10.077851+00	2026-01-12 15:48:10.077851+00
92a2fc64-5d06-400e-9c27-cc5176dfd13a	Pizza Toppings	multiple	f	0	5	2	active	2026-01-12 15:48:10.077851+00	2026-01-12 15:48:10.077851+00
01c3923b-864f-473b-b32d-d6a812185e73	Sugar Level	single	f	0	1	3	active	2026-01-12 15:48:10.077851+00	2026-01-12 15:48:10.077851+00
41a65414-5a50-41e3-adf0-040ce8380751	Burger Add-ons	multiple	f	0	4	2	active	2026-01-12 15:48:10.077851+00	2026-01-12 15:48:10.077851+00
b216d671-1c3b-493b-b60f-ae28686c8640	Ice Level	single	f	0	1	2	active	2026-01-12 15:48:10.077851+00	2026-01-12 15:48:10.077851+00
3f4b37d3-0e87-45f8-a731-39c94814797d	Sides	single	f	0	1	3	active	2026-01-12 15:48:10.077851+00	2026-01-12 15:48:10.077851+00
f5e04d95-e517-455c-aecb-d716816dcc9d	Salad Dressing	single	f	0	1	2	active	2026-01-12 15:48:10.077851+00	2026-01-12 15:48:10.077851+00
e7702df6-bf09-45eb-8b4e-ee9f719d71fd	Size	single	t	1	1	1	active	2026-01-12 15:48:10.077851+00	2026-01-12 15:48:10.077851+00
\.


--
-- Data for Name: modifier_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modifier_options (id, group_id, name, price_adjustment, status, created_at) FROM stdin;
365e4c7e-1530-4996-9f61-8d5fc7ff0d8f	dbacad5f-ba01-4192-a754-df335b6b3948	Normal	0.00	active	2026-01-12 15:48:25.049431+00
852fef3c-7eab-4645-94b3-cbf0126efdee	dbacad5f-ba01-4192-a754-df335b6b3948	Less Alcohol	0.00	active	2026-01-12 15:48:25.049431+00
d65f40ca-8f32-45d1-a378-f6f200948c38	cf9d8a62-fb22-4fdd-823d-789fbbb0ab82	L	1000.00	active	2026-01-12 15:48:25.049431+00
e04054b4-51dd-4bbc-a744-40c2fa59c334	cf9d8a62-fb22-4fdd-823d-789fbbb0ab82	M	500.00	active	2026-01-12 15:48:25.049431+00
9bd5e729-472d-48ca-accf-2146117bf55b	cf9d8a62-fb22-4fdd-823d-789fbbb0ab82	S	0.00	active	2026-01-12 15:48:25.049431+00
9d8cd20e-06c1-440b-99ea-bebc54a51f73	3d2951b2-0847-42c4-9ba8-d7e90a6c430c	Extra Beef	2500.00	active	2026-01-12 15:48:25.049431+00
e41c99fb-3c6f-4d5e-aa75-779a8f85e8e6	3d2951b2-0847-42c4-9ba8-d7e90a6c430c	Extra Jalapeños	800.00	active	2026-01-12 15:48:25.049431+00
a967553d-5124-4622-96b2-66982a681d2e	3d2951b2-0847-42c4-9ba8-d7e90a6c430c	Sour Cream	1500.00	active	2026-01-12 15:48:25.049431+00
f49af9c9-a2c1-4b12-9231-0cde2bfc969e	3d2951b2-0847-42c4-9ba8-d7e90a6c430c	Guacamole	2000.00	active	2026-01-12 15:48:25.049431+00
1a6b56c1-8229-4b20-9177-f412662710b5	92a2fc64-5d06-400e-9c27-cc5176dfd13a	Basil	500.00	active	2026-01-12 15:48:25.049431+00
2ca267d7-7ca0-4ca6-a8a8-d9c5b242d6b7	92a2fc64-5d06-400e-9c27-cc5176dfd13a	Jalapeños	800.00	active	2026-01-12 15:48:25.049431+00
2faaf491-584e-4286-8c07-46c30125ff9f	92a2fc64-5d06-400e-9c27-cc5176dfd13a	Olives	1000.00	active	2026-01-12 15:48:25.049431+00
8287a383-451e-4258-a07b-14e46349a47f	92a2fc64-5d06-400e-9c27-cc5176dfd13a	Mushrooms	1200.00	active	2026-01-12 15:48:25.049431+00
285c28d4-2c71-4a48-8ce3-2a2153afd8f7	92a2fc64-5d06-400e-9c27-cc5176dfd13a	Extra Cheese	1500.00	active	2026-01-12 15:48:25.049431+00
df59c9af-7593-4318-bb52-1315943b1332	01c3923b-864f-473b-b32d-d6a812185e73	100%	0.00	active	2026-01-12 15:48:25.049431+00
923e232a-6afc-4fea-9b65-5590ca32fee1	01c3923b-864f-473b-b32d-d6a812185e73	50%	0.00	active	2026-01-12 15:48:25.049431+00
83918d13-bc15-461a-a9cf-5198d71c2f57	01c3923b-864f-473b-b32d-d6a812185e73	0%	0.00	active	2026-01-12 15:48:25.049431+00
ea1d5b4a-e392-4e0b-a86c-593a9f9a5f37	41a65414-5a50-41e3-adf0-040ce8380751	Bacon	2000.00	active	2026-01-12 15:48:25.049431+00
3c933145-142a-4e90-9535-2a06e6ae2a81	41a65414-5a50-41e3-adf0-040ce8380751	Extra Patty	3500.00	active	2026-01-12 15:48:25.049431+00
f654c410-94a2-408c-834a-bd79f18b6f19	b216d671-1c3b-493b-b60f-ae28686c8640	Normal Ice	0.00	active	2026-01-12 15:48:25.049431+00
ce2a2767-ac46-4aba-9ef6-a807cf99f0d1	b216d671-1c3b-493b-b60f-ae28686c8640	Less Ice	0.00	active	2026-01-12 15:48:25.049431+00
ea410036-efee-4215-93a3-6ce746c6863f	b216d671-1c3b-493b-b60f-ae28686c8640	No Ice	0.00	active	2026-01-12 15:48:25.049431+00
ac6c2fa2-3d69-454d-a209-8dfa41c7933b	3f4b37d3-0e87-45f8-a731-39c94814797d	No Side	0.00	active	2026-01-12 15:48:25.049431+00
70e9bde8-84fe-40a5-aac0-af03045655ab	3f4b37d3-0e87-45f8-a731-39c94814797d	Salad	2500.00	active	2026-01-12 15:48:25.049431+00
54c2ae2d-4fe6-4d4a-9e6e-5f408ecf2529	3f4b37d3-0e87-45f8-a731-39c94814797d	French Fries	2500.00	active	2026-01-12 15:48:25.049431+00
86163243-afe4-42f1-a51b-ff0879a8c4c4	f5e04d95-e517-455c-aecb-d716816dcc9d	Yogurt	0.00	active	2026-01-12 15:48:25.049431+00
60667fa0-2744-4161-bd28-238fe9eb2a54	f5e04d95-e517-455c-aecb-d716816dcc9d	Balsamic	0.00	active	2026-01-12 15:48:25.049431+00
b95e9a30-bc0a-4e2a-8f39-e317ff46d0a7	f5e04d95-e517-455c-aecb-d716816dcc9d	Olive Oil & Lemon	0.00	active	2026-01-12 15:48:25.049431+00
568fe14f-fd81-442f-865e-78ed5088bbf8	e7702df6-bf09-45eb-8b4e-ee9f719d71fd	L	3000.00	active	2026-01-12 15:48:25.049431+00
8227bfe6-6c4b-4c15-b4f3-7eaa0733cb61	e7702df6-bf09-45eb-8b4e-ee9f719d71fd	M	1500.00	active	2026-01-12 15:48:25.049431+00
7825eeb7-54c4-496c-a113-3691c1849451	e7702df6-bf09-45eb-8b4e-ee9f719d71fd	S	0.00	active	2026-01-12 15:48:25.049431+00
c2c3375c-1e55-4176-bf7f-35f711ef208b	41a65414-5a50-41e3-adf0-040ce8380751	Fried Egg	1800.00	active	2026-01-12 15:48:25.049431+00
440e8363-dd46-4edf-a6dc-3fc57469b601	dbacad5f-ba01-4192-a754-df335b6b3948	Strong	1500.00	active	2026-01-12 15:48:25.049431+00
35e7d672-894c-43e7-92b8-1c2e22964a07	41a65414-5a50-41e3-adf0-040ce8380751	Cheddar	1550.00	active	2026-01-12 15:48:25.049431+00
\.


--
-- Data for Name: order_item_modifiers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_item_modifiers (id, order_item_id, modifier_option_id, modifier_name, price) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, menu_item_id, item_name, price, quantity, subtotal, note, created_at, updated_at, status) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, table_id, user_id, guest_name, total_amount, payment_status, note, created_at, updated_at, subtotal, tax_rate, tax_amount, discount_type, discount_value, final_amount, payment_method, bill_id, session_id, status) FROM stdin;
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (id, user_id, token_hash, expires_at, used_at, created_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, user_id, token, expires_at, revoked, created_at) FROM stdin;
93ae5f4c-407c-4e64-9dc7-d4ca2f738862	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	7260fe2d981a64e5ac510422c73d61c95ce84e6442de58ff6b8188b4edd8aca3	2026-02-10 23:11:46.335+00	t	2026-01-11 16:11:46.237909+00
85f9e1bd-031e-487b-a0e8-f8ac90a23f89	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e00523bba55043818957202e86897efd0a3de2afe6d6c3ef55a4411dde7ead69	2026-02-10 23:21:05.666+00	t	2026-01-11 16:21:05.573586+00
c68beee0-5c64-4eaa-bcfe-b291f9525342	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	67562c9d1c550d7f106b8c934048d6915e47346df4ff59359f903cb070ca60e7	2026-02-10 23:27:34.02+00	t	2026-01-11 16:27:33.927853+00
ca53594d-e43f-4b94-bd8f-c1b614e73467	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0fbd1e944fb53d13d37a2c7b80668d300320d25e148473affd7983fc9ae6e17a	2026-02-10 23:35:33.682+00	t	2026-01-11 16:35:33.593342+00
b0c870d9-05ab-4922-8229-1b6b2f6d792a	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	f3eaae9283204c762885f0d502386c5dcf9af06567b7c33aa172811b68ff1bf3	2026-02-10 23:41:34.918+00	t	2026-01-11 16:41:34.828092+00
70c47bb6-f351-4f8c-9900-31b0fe7b26b8	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	d3586e643cd7201026f334b7fc9d687cea68e44d0dc57521885ff57e1b548f3c	2026-02-10 23:47:08.977+00	t	2026-01-11 16:47:08.89667+00
654e45db-5241-4e89-a181-1622f4b4afb9	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6b6f52bc7f674c710950d26905f1e602a0b25507fd1bf2d48eb9870c0c497f9d	2026-02-11 00:24:01.169+00	t	2026-01-11 17:24:01.106912+00
8261309a-fba7-46c5-9fc8-fbc196ea70f8	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	75e3eae92beecfd94c1f8d8395e52bda745db2d1c54965361471c8428103a648	2026-02-11 00:45:41.684+00	t	2026-01-11 17:45:41.626179+00
d28ef07f-f0da-4cdb-81dd-74b5f5d8b60b	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3845372a55d0f53e12431df01a725906cb79e05d4351ed0da451993c095ee24c	2026-02-11 00:51:26.343+00	t	2026-01-11 17:51:26.29114+00
1c2b767a-3113-4493-b32b-a5b78d20ec99	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0f1854314d48dcdcb5946268dee8efc3a6e8f9ff53066c5594c0420a9db486a5	2026-02-11 00:58:01.44+00	t	2026-01-11 17:58:01.398213+00
02c4052a-732d-43d3-83c4-f6a58c098230	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ab526983f7e6f5d524c3ce33fe8aa07d1fdf0ed35ed43a07b459de799e45401f	2026-02-11 01:18:44.156+00	f	2026-01-11 18:18:44.122983+00
b9263a7b-1fcf-4ecd-97ba-6b08956f5249	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8fe7e605202d590375768e3c4a3204085ff8fe7a1715375a4be03d5cd007ca68	2026-02-11 12:42:28.521+00	t	2026-01-12 05:42:28.642434+00
927b00aa-7ac3-4d21-85ed-62d972d9572f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	38c87360b4f73e6c17f44c6605c19deb775d59bfd2b3c0e9ec40ecb120d06c01	2026-02-11 13:02:38.704+00	t	2026-01-12 06:02:38.852124+00
4584c4ac-9607-4a79-8d29-f1f209c9b7ed	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	db4b7c9317f72e5b1bec36648c3bf988fe2d611b87726a6ab82ab31262bf9a98	2026-02-11 13:30:11.893+00	f	2026-01-12 06:30:12.061576+00
71cc8532-e495-40d3-86bc-d62b022c3291	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1442faa3d0333663d85caab810bcd6dbbdf1dba4c26a3383d051e5bdc944edbf	2026-02-11 13:30:25.432+00	t	2026-01-12 06:30:25.593494+00
a646d101-1cb2-4769-a536-06680fe62004	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	161dc2906def6d8a5e0143d0496ef84990754e6dc2365813da842fe6a31f5459	2026-02-11 13:35:46.882+00	t	2026-01-12 06:35:47.041243+00
125b825d-97b4-45fb-ab16-f540355c8c24	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1571bf2394b685f09c83e37e3bddb9247be0c0b1b9d37bf1ad6eb2fa30981d89	2026-02-11 13:45:45.446+00	t	2026-01-12 06:45:45.622234+00
da9b438b-5903-4f3c-8d15-c4e24df530b6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	7a1ecb6a51e5421b7398e1bfd699d7b0fca68964f6f2949f85c0ac6f77594e4f	2026-02-11 13:52:20.827+00	t	2026-01-12 06:52:21.023599+00
9f87ff1a-ee43-4b38-a3b5-d97c532c1d1d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	50a3ee70c6639d9d60cedcd482cbaef261f900bb0dd5e0376bce9f2e9d4b9df6	2026-02-11 13:57:38.763+00	t	2026-01-12 06:57:38.9668+00
a3b103c1-02ac-4400-b25a-6ada30274266	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4ef1ffc1baf73f02441ae58577c504845fc4ec007ece322f6b92d677af806348	2026-02-11 14:07:56.75+00	t	2026-01-12 07:07:56.956348+00
9166e236-41fa-4d7a-995c-3d043d06fa31	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	cc4542e659c92c43f18fa7e847c7abdc451fea60688b3b1ecbf3304edc215c7a	2026-02-11 14:14:50.609+00	t	2026-01-12 07:14:50.810052+00
bbeaffca-4108-47d8-bc81-1dd96b9a942e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	d1cb6dfd379439f6eecab54a2a03c63342aa347465d7ea9228fc6dccdd2992e3	2026-02-11 14:20:41.68+00	t	2026-01-12 07:20:41.89877+00
6ee281b6-c261-4f22-9787-baaa115c9ff1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ba44d389250ef9f84d38815b5e74282e5341bbeebef565df0eccf0f39a695de4	2026-02-11 14:29:04.289+00	f	2026-01-12 07:29:04.511155+00
f3cad9d7-3116-4700-b53a-204e32b0d207	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c13f63332db5568c88cc278b318fec43aa2b6389ddec8fc20a5857a8c068ede5	2026-02-11 14:41:45.943+00	f	2026-01-12 07:41:46.18501+00
5b8634c7-cc4a-4953-bbfd-0df2b405da86	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5ea8282907732c3512acb85275370211b669a20e92d0792f02a5b4b9bb3f827e	2026-02-11 14:42:03.861+00	f	2026-01-12 07:42:04.104058+00
d64fd136-9d5c-4a53-b1fc-860eb3af7495	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	7910f2b355ba9a6e36ccfb85ed29106f4b2e4dfeb222281a70c39a22ad25acf3	2026-02-11 14:42:56.278+00	f	2026-01-12 07:42:56.512755+00
714516cf-6e46-4911-8abc-ec39438211db	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	090b80061967bfcff2305338f2c77dcc3dcf6e2f5bddcd85306456482fb37c54	2026-02-11 14:45:14.149+00	t	2026-01-12 07:45:14.402058+00
2bf4f80d-3c11-46b2-93b8-c7c21edd540f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a7fa551e6e9d7b377ef34666af0676d8bdf07f2adfb1fa6940c888271cd23ddf	2026-02-11 01:19:02.148+00	t	2026-01-11 18:19:02.117815+00
102b6a24-7b83-4dce-9f77-bd52ba67d6b2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6e4b0365af69e8c9f9ec637541e7ee70aa6292ed889fccc4d6d4ea047fa8f086	2026-02-11 14:53:45.359+00	f	2026-01-12 07:53:45.154347+00
54fd6786-a112-48bb-937e-655c02be14d6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	f9bc3c34df27308dd9f890a9bc1ccd5ebb2b80c8511fe69d0c8f515311d70dc9	2026-02-11 14:56:16.44+00	f	2026-01-12 07:56:16.244425+00
93cd29dd-c7cd-4dc6-8481-7aae6a4a88e1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a12d1a41f5b06ca5dfaada92104c39f5f55529aaacde83702d83c13a5bc56768	2026-02-11 15:02:55.533+00	t	2026-01-12 08:02:55.330472+00
a5b287bd-8d40-4f2f-be63-4953365ae5e7	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c20d1a010cc6b6a366cfa15651dfe8fac98d98924cc1de65bc0a068aad76edd8	2026-02-11 14:50:52.626+00	t	2026-01-12 07:50:52.864504+00
78de69ac-65aa-4628-814e-3803a9ee0ecd	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	92ff10d5da9da50bf229cd055342b4dcaf8e2774e9b84e842fce475aa1a5ab3b	2026-02-11 14:56:35.908+00	f	2026-01-12 07:56:36.149408+00
03d8cb29-1fad-4e5f-b196-9de145b5d5bb	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1b9aa8e73ba7c1380fb8b51cd2f97296b63fd68e5e908f8c8c6a17cc2328839c	2026-02-11 14:56:46.714+00	f	2026-01-12 07:56:46.531247+00
fca2d0ec-db35-4146-baa5-fcd600d66ade	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6832d842236dadf65c965c759598df304e9e7123899481e50fdbd451249907a6	2026-02-11 14:57:00.78+00	f	2026-01-12 07:57:00.581281+00
76f1fcd8-1101-47c7-beb2-fefaee66414a	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	050a3fcd112552d545e0c2aa154be2cd88f25c75837dc0e2c92bf03129a45b9c	2026-02-11 14:57:13.055+00	t	2026-01-12 07:57:12.861452+00
82064803-1cad-4ed7-a04b-b9b770323871	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	92ff10d5da9da50bf229cd055342b4dcaf8e2774e9b84e842fce475aa1a5ab3b	2026-02-11 14:56:35.81+00	t	2026-01-12 07:56:36.062125+00
e9054b7b-5de6-473a-9d14-f15f21e6b1f4	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	66c0f0c75e71450bbcceaccc7e9da9c3446d8f21a9edb6919156bb89f69cb8f0	2026-02-11 15:04:11.26+00	f	2026-01-12 08:04:11.5267+00
3543a193-208f-44dc-9703-ab81e403fbe7	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	66c0f0c75e71450bbcceaccc7e9da9c3446d8f21a9edb6919156bb89f69cb8f0	2026-02-11 15:04:11.142+00	t	2026-01-12 08:04:11.394694+00
d929559c-48fd-4d58-94e1-888409b31c36	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ac072ba45abef4e1232b133e91c83bf02e772481f8ab00adf768d43f08df92b4	2026-02-11 15:21:14.584+00	t	2026-01-12 08:21:14.842058+00
c73dbefa-3653-4db1-952a-5f32e2ceb8ef	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0d67f04ebb58a484e704adca866acf27c5427650693a281feb66c4898e75281c	2026-02-11 15:09:12.235+00	t	2026-01-12 08:09:12.507698+00
0577d1d1-7a8d-4f3a-a484-322d0d5764d4	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	eaed4db48af4042197df050fb12b34c53b5352d432900d2c1412b85d94f6cf70	2026-02-11 15:15:48.894+00	f	2026-01-12 08:15:49.15995+00
a6611f04-bdfc-47f6-8bda-f8faf16d0422	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	eaed4db48af4042197df050fb12b34c53b5352d432900d2c1412b85d94f6cf70	2026-02-11 15:15:48.857+00	t	2026-01-12 08:15:49.12243+00
e50a847d-815c-41fe-8c92-5cd97c74c4d9	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	f38f4be22c60044b193c4af560a0bfa41c4fc55537ce09340137ae654f165792	2026-02-11 15:26:37.646+00	f	2026-01-12 08:26:37.910629+00
8269ffb8-97e7-4106-8d99-02107ceb4907	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ac072ba45abef4e1232b133e91c83bf02e772481f8ab00adf768d43f08df92b4	2026-02-11 15:21:14.589+00	t	2026-01-12 08:21:14.848455+00
07e2ee1e-c25c-44bf-a690-2e9a4e997753	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	18e252504a0f2f5b3b41cb7652bcc0d31547073e21b0b3437ab4d27ab095043a	2026-02-11 15:15:26.765+00	t	2026-01-12 08:15:26.5759+00
dada916e-4613-40b3-8abc-d4c25315803f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	f63d02fba76ff97e6e8754e8aa73aa2ceb1a84d3b6332cfb209578641f5b73e5	2026-02-11 15:26:45.393+00	t	2026-01-12 08:26:45.203064+00
3f54fa2f-03b0-4ba4-b5e5-2dc16a9e6c40	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6d1bbd284cf5a695fd1e0f15ee54f710d5e695a5a23ded98dbbf53e4f94e2192	2026-02-11 15:26:38.654+00	t	2026-01-12 08:26:38.930146+00
6713726d-87f0-4025-b8e5-954a35c0268d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	eca4c7e9b590315d5072f19bda9e0d675d537f45736aff00444bb189ba5fa5d3	2026-02-11 15:32:04.355+00	t	2026-01-12 08:32:04.165443+00
4bb27e37-e1f1-4e70-8ada-85da4c7ced39	637ad6c2-4ebe-4a34-9dee-4069973bf704	bc23844a325656752e716ef70935c67fadf35eddbce47e5b1e4b5abb7171d1da	2026-05-28 08:37:54.824+00	f	2026-04-28 08:37:55.385998+00
e0265326-9524-4ef0-99e9-af4534cfddf4	637ad6c2-4ebe-4a34-9dee-4069973bf704	c4a14a811c687a5f92da9c88367004baabf498e2af3275a631d3336c553ed119	2026-05-29 09:26:57.291+00	f	2026-04-29 09:26:57.990226+00
5d60c2b7-dec3-4daf-b1b7-912d077f3672	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	466e490110a3aba37f18a562e9bcb05764fbd8a12ac4488c6fcd2405b658cbe5	2026-02-11 15:32:08.122+00	f	2026-01-12 08:32:08.393828+00
1bbc6562-6430-45c9-8334-3993645ed27c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	48f5e7c7afb6a48c94afca1e94f97c0f485e0dd65aae9473e0d5ada7f2d36996	2026-02-11 15:33:27.888+00	t	2026-01-12 08:33:28.171226+00
6f3a106a-6154-4a24-b20c-c6d60c5441c2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	dcbbdc36d78083174d40c14ed165da78d173d52be94f4dbef82fe8a047cf33a0	2026-02-11 15:37:52.176+00	t	2026-01-12 08:37:52.002932+00
802feee9-031d-4fcf-9541-d547a87b6fab	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	20b374d94ae0c0a2e249dee322c347e3d41ae2fbe242ee1ad2d10be0f540c28a	2026-02-11 15:38:38.652+00	t	2026-01-12 08:38:38.933034+00
ca172f08-e39d-47d4-b8f2-2144a950f958	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e0af5a8750662d512a5090f2ed8f4a5206dc302663ffab60a0bbec3ba4b7eee7	2026-02-11 16:32:18.109+00	t	2026-01-12 09:32:17.962121+00
f1aa342f-0a32-4a4d-9a5b-e295ab925667	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b854b9d05f0a53a6270b260c4a1a34a14539d59466aed8ef42eaae6911510534	2026-02-11 15:45:17.405+00	t	2026-01-12 08:45:17.703001+00
f2107306-0da7-4b6f-920a-47ca6a52d008	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	131adfb0bcc17c648a0be2ca18595915a9b915bfc46198031644db9129615051	2026-02-11 15:51:54.384+00	f	2026-01-12 08:51:54.679202+00
6a7e1690-a509-495a-950a-a8ff55224630	637ad6c2-4ebe-4a34-9dee-4069973bf704	071cf1b8c6823ed525263248a3cce7268b0f53ad081f6052f8698570e342ff0b	2026-03-04 04:50:29.897+00	f	2026-02-02 04:50:29.693611+00
1c78a4b6-e381-4d8b-b0b3-5a4e9c5f72e2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5dc8e8e0c5d29e9be3618b488e2248af70796bbab4806b3c1014dea5eb04f720	2026-02-11 15:58:45.91+00	f	2026-01-12 08:58:45.705776+00
f1153fdb-2c8a-4477-88cd-206df75603bd	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	131adfb0bcc17c648a0be2ca18595915a9b915bfc46198031644db9129615051	2026-02-11 15:51:54.342+00	t	2026-01-12 08:51:54.629936+00
9748ccf8-ec82-4b42-9b48-218237c52693	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	62e0afe71d4bdd4d77ba4eab1c59e6e6cc73ca82032a2f6b7912d8aacb5e7ac3	2026-02-11 15:42:54.456+00	t	2026-01-12 08:42:54.28187+00
e63fd9a2-759f-41fa-a2d1-537ce551225c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ec667fb83fa9a9062112bb6e8a7fe510d4bb7040e0c3af956f8a0a97d1f2daa8	2026-02-11 16:01:26.573+00	t	2026-01-12 09:01:26.425647+00
0eaee44b-0aaa-43aa-b7da-67c9c57979b6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2be3d5071943869aff5538ec6952b21921f2c10205b204eb5f1366bc1ec88c84	2026-02-11 15:59:35.044+00	t	2026-01-12 08:59:35.3409+00
be122f8f-8592-4421-90f7-bbb13f52253b	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	cd32ced61b42bcc1bcb34fddd41ca41280ef394b4708bbfd9974ce89f755232e	2026-02-11 16:08:54.532+00	t	2026-01-12 09:08:54.850006+00
12fb9a6e-52f2-41d8-b541-9f8d0b62960f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0369b7042704f2c8ac4c294e04b91ca4f4431831b4e305246f9debe9d7bea164	2026-02-11 16:08:36.528+00	t	2026-01-12 09:08:36.356929+00
754f22e3-c60e-4419-b5d7-7684a52620d6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1cbcc7551628fd99736721a49d7a9b96fd84a0c5a6fb5faec57b65df901de9e7	2026-02-11 16:15:20.004+00	t	2026-01-12 09:15:19.846053+00
a62348ea-b19f-4529-a774-b55d755be13b	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	80c95858ab4fd60b2b31bb7ad363efaff0f828b0597ec595e03e733b5d74624a	2026-02-11 16:14:21.649+00	t	2026-01-12 09:14:21.959857+00
0fabee67-3376-4853-8bca-7e91a69ef5d5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	130d35b4d974b021538e7040a23ec2dc9231cd1fa0f89d8c0400bb8ba3cd6b81	2026-02-11 16:37:54.876+00	t	2026-01-12 09:37:55.214589+00
f98f5568-8be6-4067-a271-701cc16c651b	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	80c95858ab4fd60b2b31bb7ad363efaff0f828b0597ec595e03e733b5d74624a	2026-02-11 16:14:21.729+00	t	2026-01-12 09:14:22.03779+00
b04fac34-ddc6-4440-ac7c-8a91d46b682d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	16976320dd83f36866db9acf46527cb79deb5f4847e21afb30a9b262024796ec	2026-02-11 16:22:58.603+00	f	2026-01-12 09:22:58.93375+00
2ee3ecc0-2351-4992-b8e2-f8867ea11df3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	16976320dd83f36866db9acf46527cb79deb5f4847e21afb30a9b262024796ec	2026-02-11 16:22:58.675+00	f	2026-01-12 09:22:59.00377+00
211069e1-bc5c-4c13-a3e1-5070ba46b161	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	16976320dd83f36866db9acf46527cb79deb5f4847e21afb30a9b262024796ec	2026-02-11 16:22:58.214+00	t	2026-01-12 09:22:58.531457+00
05b994b0-820e-407d-a945-68e2ef151c72	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b3eb762d7997090ec2c9dc8e36ca75e4949b246dc460f9a791fc40e2908de73d	2026-02-11 16:29:20.979+00	f	2026-01-12 09:29:21.304024+00
a65858fa-78bf-4b7f-b8b7-175ce9ea8958	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b68e8877e8625e23f208d51e2613265f3b02cac04ac9e9f1ab64b3e47049626f	2026-02-11 16:22:06.943+00	t	2026-01-12 09:22:06.77325+00
15078ad8-ab1c-4939-88be-ded200655b4f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a8e2f5ed34dae6f9108ff745849a27f283a740dc3f9b5aecd921771a4ccac1b3	2026-02-11 16:29:21.064+00	t	2026-01-12 09:29:21.404435+00
c68348ec-b982-46f2-93c6-b26595dd9e02	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c0c5ce770886304438d47b7026029939e7b87eefcbbae83cf5d3ffc412df2ea1	2026-02-11 16:37:46.295+00	f	2026-01-12 09:37:46.624929+00
579c94ef-acdf-4609-a543-14cbc6499890	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b74369634a80f27134438fa405d32b04e36ff2868d2e41f0829a1b065d3a4960	2026-02-11 16:43:14.328+00	t	2026-01-12 09:43:14.179116+00
50963378-b29d-41ff-932d-89b50a4e8a9f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b74369634a80f27134438fa405d32b04e36ff2868d2e41f0829a1b065d3a4960	2026-02-11 16:43:14.639+00	t	2026-01-12 09:43:14.974814+00
0ef58c2d-8cbc-4308-95cd-49d01acbcd68	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	263f9344cd4ec01fdfcdc249c29c2580f3c5b6e04860da69c5b772d39d2a1896	2026-02-11 16:59:25.429+00	f	2026-01-12 09:59:25.782804+00
fcdd0c06-bbc8-49d8-a56d-252828890a6d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e624858615edea327f34e1b763567f5c76099710428022a35c77d040706fd562	2026-02-11 16:54:17.333+00	t	2026-01-12 09:54:17.189864+00
5079e10b-0aab-446a-bdd6-ed17691db341	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	339449c66b09b4b0345077de2fc43d80597c16d22bddf34f81fb28603f57cf1d	2026-02-11 17:00:03.391+00	f	2026-01-12 10:00:03.259769+00
652efe29-e7ee-48d9-8e21-983e5a0c340d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	64b5d927cfea759e7c64e0c09c61731de5bc5792279927a34d7972602ff84209	2026-02-11 16:55:06.646+00	t	2026-01-12 09:55:06.491859+00
b03c38aa-b9c3-4862-a240-84d805957516	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	263f9344cd4ec01fdfcdc249c29c2580f3c5b6e04860da69c5b772d39d2a1896	2026-02-11 16:59:25.417+00	t	2026-01-12 09:59:25.775706+00
56bf6839-f161-4629-b41e-1fe7ba0cb2e8	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	bb492d95a0b2b5b5780344371c1cb0fa38d1aa59349609e309b149249e5cfeb6	2026-02-11 17:01:36.354+00	t	2026-01-12 10:01:36.202897+00
9005ef45-86b7-403f-bd01-a97d90555e7e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1a7f0e9a5731e49fc28d92267b4c058bb8595437740845d22f49cd5bd316338a	2026-02-11 17:00:30.333+00	t	2026-01-12 10:00:30.188088+00
646007de-8b47-4f94-97b5-1e99e4c5600b	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	acceb49c9de1152b7b83d182730dfa4655b4b03991fc3a4ca49b60c2cc5ee30f	2026-02-11 17:06:51.522+00	f	2026-01-12 10:06:51.393585+00
f4e06e67-d64b-4d64-ac8a-c524c7f947f5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	acceb49c9de1152b7b83d182730dfa4655b4b03991fc3a4ca49b60c2cc5ee30f	2026-02-11 17:06:51.521+00	t	2026-01-12 10:06:51.392815+00
1f788ee3-3bfd-4b6d-909b-627c34669ddb	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1adc0631fc9912449c631a43e5541006231fb33189ca18d42b7037d693993e61	2026-02-11 17:07:08.917+00	t	2026-01-12 10:07:08.772331+00
bc429071-5137-4701-b935-bd84da08ee7a	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	22c925265e3b4fec01059dc4fd48886f3c1ccccef6f196b1f2aa787988f2f05e	2026-02-11 17:05:17.503+00	t	2026-01-12 10:05:17.860715+00
bee0b3fe-1471-4155-be4f-1e2c95538626	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	742042c88e4104623f078d6caf898430874311a95e80035b2b8182fad1b8b997	2026-02-11 17:13:06.394+00	f	2026-01-12 10:13:06.752059+00
43b5bd2e-b08e-414e-aa1f-43cd2c9dfafd	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	742042c88e4104623f078d6caf898430874311a95e80035b2b8182fad1b8b997	2026-02-11 17:13:06.351+00	t	2026-01-12 10:13:06.732243+00
8ac28264-f8aa-4336-b83f-577311aa54d0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b2f647ffad48c3af6e9c77ebe34ce168863e53604ab1d810a0c67d0493da1fd3	2026-02-11 17:20:21.525+00	f	2026-01-12 10:20:21.896563+00
63d7a78f-39b4-4802-8e91-47f420c955be	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b2f647ffad48c3af6e9c77ebe34ce168863e53604ab1d810a0c67d0493da1fd3	2026-02-11 17:20:21.517+00	t	2026-01-12 10:20:21.889711+00
d3008e06-1c95-443a-a2fa-8f270efb6cae	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	76d5bd9a3b640d4b1cf01b3db01b34acb3a3b9277243d280220b5b8638cbbf1a	2026-02-11 17:30:01.566+00	t	2026-01-12 10:30:01.432142+00
23fa05b6-297d-4350-ae38-8a0494b8a214	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3d4f62ed406e9c6b30b877453bf4ab9f5d7bd1dd765a533f5f676a0ba99e11a4	2026-02-11 17:11:53.655+00	t	2026-01-12 10:11:53.519624+00
c046e1df-3161-4fc6-85d6-f29f49ad5a70	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	aa1ef9995c0a19d641d68bf04c96a70335d640708d2f37ca237526bd87101080	2026-02-11 17:36:09.02+00	t	2026-01-12 10:36:08.885644+00
53b1f8b1-5810-4ba0-91a0-06a37717d922	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b7e822037012705202a77e2dd45bfd673a8eea7856828d01caa4168c77cbb8a8	2026-02-11 17:33:07.619+00	t	2026-01-12 10:33:07.974754+00
9db8da30-cc55-4510-8ec1-aa2bf80ade71	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3d600ab390bef57b22dba6abc9bb8d45fe9c51a60bdfaa0adec96276522561df	2026-02-11 17:36:08.863+00	t	2026-01-12 10:36:08.730596+00
da285568-7d38-4fc9-ac1c-e84a448f60dd	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b4a8182277446f7f64da3fb1d674d93d422ba765cdda06adbaf56fee8ca39428	2026-02-11 16:14:21.289+00	t	2026-01-12 09:14:21.07006+00
3714b0c0-7b52-4f3d-90ad-c37624605bef	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	50ecf58e026ef8b377b63f7fe4b0bee6c7270c06568a8eb362577420d3f64bc9	2026-05-28 08:39:31.015+00	f	2026-04-28 08:39:31.579964+00
1d0dc6e7-cc1a-457b-9619-c150afab90ff	637ad6c2-4ebe-4a34-9dee-4069973bf704	c58c3aa7938f5f36b791c13d2e96ec21d14fb30d39157f20ef054c91741da5c9	2026-05-29 09:28:34.159+00	f	2026-04-29 09:28:34.858454+00
389353e6-a9cb-4a1d-bf92-d3651a1e0d76	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4e745c5b1bb378f69c3ca81c31de02e3176dfa8d80af92877f314bc0d7b6bfa6	2026-02-11 17:38:29.962+00	f	2026-01-12 10:38:30.345047+00
1354b86f-e7ea-46db-8fcd-130be054d966	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4e745c5b1bb378f69c3ca81c31de02e3176dfa8d80af92877f314bc0d7b6bfa6	2026-02-11 17:38:29.96+00	t	2026-01-12 10:38:30.340872+00
c04c7d19-9dcc-4ef5-8327-7527ea17d9b0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0f800de22eb406fc8f8778dbf79789c006474d4ca07b843091c17c0b297ba5b8	2026-02-11 17:41:29.324+00	t	2026-01-12 10:41:29.199851+00
7d70ab43-aa7e-4a0f-bdcb-3545435fac9a	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0f800de22eb406fc8f8778dbf79789c006474d4ca07b843091c17c0b297ba5b8	2026-02-11 17:41:29.358+00	t	2026-01-12 10:41:29.224597+00
9002e809-fd82-47e1-b941-e370a52d9d76	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	95ce7356f5b9ef60b247d2754ade6786e61328b869e7a06738bf411b59bec4ed	2026-02-11 17:43:49.892+00	t	2026-01-12 10:43:50.290499+00
ae17fb67-7d73-4277-96a7-3dce0e4f8097	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fa100f6585d04d9ff141c741d955d38f1e6447501957103e1ccb9acc7ff88901	2026-02-11 17:53:10.058+00	f	2026-01-12 10:53:10.464104+00
c1ee9537-497a-4227-bda2-1fce6efd353d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	856306904541d7571661c4d667b7b8d0ee9c67f59efaf673ba2fc65f7ac7e5fc	2026-02-11 17:47:29.573+00	t	2026-01-12 10:47:29.451634+00
75ee776f-c6df-4b28-97e0-e9984780ff77	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	615f381373cce7d08382cd1fe0773b54579e00f42174dff01241545ab7880cc5	2026-02-11 17:50:46.278+00	t	2026-01-12 10:50:46.156389+00
f768b4c0-5962-4c75-b4f8-c091e9bd757e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1ad88677901f4b36fdb18bf88e56adbada2c4a6ac08c0550ba87b9861af534ed	2026-02-11 17:53:39.09+00	t	2026-01-12 10:53:38.978776+00
f6ec4098-d20a-4e43-a938-47c062f73e67	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a3d08775493d8e67b1a75113856c6893a05e71d8f8dde1d899ec0066835406cc	2026-02-11 17:53:19.793+00	t	2026-01-12 10:53:20.19348+00
eaa6c4b4-34c2-4562-8485-63983f925aba	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	30d62a064ac3a9cadbe8288c47ffea9c33ce3dbe344bdf44ebd8e9c0a0be7a29	2026-02-11 19:03:03.622+00	t	2026-01-12 12:03:03.536122+00
ffbd8a0d-ada6-41d2-95d3-10e83ecc44e3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8276b4f8ca9459b3ae9992d56d4082126e63e54262e57ef425b5a3151990c95f	2026-02-11 18:00:05.485+00	t	2026-01-12 11:00:05.894208+00
443ba3fa-57e7-45d9-a0be-d2e421020773	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	d87f5a900864e49b54b9bcb75e3689152b2d82043930c568a17b0c3529da9fee	2026-02-11 17:59:01.514+00	t	2026-01-12 10:59:01.40545+00
321c379d-ebce-4792-b584-708b7e2bbb44	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fa98f7c9c57fde8ce083b0694986da9a46fa55099fb73ead8fa08da85c619f03	2026-02-11 18:05:31.446+00	t	2026-01-12 11:05:31.857583+00
f90c73fd-8c8a-4d27-80fc-28af5f621093	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b4533552fd6332e67495fa284ac93e44cf62075f8da90fb5a7fe9fc6c6b1947f	2026-02-11 18:12:21.832+00	f	2026-01-12 11:12:22.259276+00
4c1884c0-dbc6-4d49-bf35-ec76cd3a093f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b4533552fd6332e67495fa284ac93e44cf62075f8da90fb5a7fe9fc6c6b1947f	2026-02-11 18:12:21.913+00	f	2026-01-12 11:12:22.336824+00
f2362b95-b2c8-4195-9f38-b0e65111100c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fa98f7c9c57fde8ce083b0694986da9a46fa55099fb73ead8fa08da85c619f03	2026-02-11 18:05:31.452+00	t	2026-01-12 11:05:31.878154+00
aeecd79d-6825-4531-8e66-4416c64ba2fe	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	be62f6eacb05464204d505ae5dfc677bbc2937facf8e86725c9a7aa15f6f72de	2026-02-11 18:12:22.391+00	f	2026-01-12 11:12:22.821646+00
b52b8771-85ec-4332-b49b-1ac890a2d6e1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	466a63c1c8092c6938f07854fb4e5459bc60eb9bb028407a475cb58f552aab94	2026-02-11 18:21:28.859+00	f	2026-01-12 11:21:29.313803+00
e4a51213-87ec-459a-ba31-8ea35c6a157b	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	54a307329f8c380dba5428ca27b45ae2047db8765912f552a5979f963b4126be	2026-02-11 18:22:21.18+00	f	2026-01-12 11:22:21.615609+00
7cbc248f-d0d0-4338-b295-bf6f9e852379	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	eb5d7e84f3083220f395f86f61cc2f2e3b72bed66778f6804d6aae0518114d41	2026-02-11 18:27:25.179+00	f	2026-01-12 11:27:25.635044+00
7aafab08-fb38-44bb-ab09-7ec2da966895	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5afa8bc467ec3628ddd6de54be2402998f0ec4ac3d03b0f45597edd1efa63223	2026-02-11 18:31:53.563+00	f	2026-01-12 11:31:54.021496+00
041f3b3c-7980-4fcc-9c97-f7ffa88f8425	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	570392e61511e9d5afc707b4fe6439ee4ef21dafd088f957e7f4d84707a6a23d	2026-02-11 18:33:56.16+00	f	2026-01-12 11:33:56.605431+00
3569aa24-86b3-4b71-a4d7-b364856b7c46	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	9465375ba1850f9c0f18c2cd4f4dc5332408eec11b34f2ac277bc57a3f6036c9	2026-02-11 18:52:20.929+00	f	2026-01-12 11:52:21.366276+00
69b80534-cc85-42c0-b233-0b13159020df	637ad6c2-4ebe-4a34-9dee-4069973bf704	3cd89e99071db9cd5af6db7949ad4de73a4d6aeaf5a30540a1269b9195091415	2026-02-19 13:51:37.439+00	f	2026-01-20 13:51:37.560136+00
ec06e96b-efee-46ca-ae3c-c7740c8d49c2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	90f803a2531e37d65061d002f4e1ce35eb9b0fbb20dc1ac8cbc3c4c444d073bb	2026-02-11 17:59:00.661+00	t	2026-01-12 10:59:00.552123+00
01416c86-ba65-446c-aaff-6991659c5b87	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	598d778be58203c9bd9ebb486d06b0eb15c320ec78c8c6f461a18b65eb382cf3	2026-02-11 18:06:44.192+00	t	2026-01-12 11:06:44.07868+00
92de4d46-9696-41f8-9dd9-cbfb9fc0e032	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5cf005578bd1ca350e5e68259c8b69cec4b49e0c86f66fd096e82dcaf07c1186	2026-02-11 19:12:36.306+00	t	2026-01-12 12:12:36.773333+00
fdcb9622-abab-4d8c-bc36-2e528c35ea22	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6e7ea801b4d54ece0af9653dccf964141187fad08e8fe38daf9f45efbf38cd19	2026-02-11 19:22:26.853+00	f	2026-01-12 12:22:27.340556+00
c6a8eab0-abd9-4676-b248-b2bd0911489a	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	566be1bbadb784ab657b35fec951a05e2b2a0e4ff3919db867ed5db2b011c805	2026-02-11 19:03:01.69+00	t	2026-01-12 12:03:01.595576+00
8122865c-7d85-4ae0-b211-e1ac8bcbed7e	637ad6c2-4ebe-4a34-9dee-4069973bf704	15e8759c657a8aadf8b4574edfde3c0683bfa2d8ca0a881f1bd795175404272f	2026-03-04 09:29:31.047+00	f	2026-02-02 09:29:30.188915+00
e78f51d3-9245-4202-b841-8ee17781fe84	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	f685b0cd0ef2753d09bd76154d8661afb3339e472aa21ddbf130786e2949e2a7	2026-02-11 19:23:26.142+00	t	2026-01-12 12:23:26.061932+00
fa822bc4-4049-422d-b82c-2f658978e557	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2243baeae458a41a872edd581ca976fc0779c5151bce7ad85bb8045eabf64a51	2026-02-11 19:23:42.47+00	t	2026-01-12 12:23:42.397614+00
99b391d5-4f0a-426a-84a5-aaa5d0446af2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	53e48d5cc83d68ba87f6786b77db146b006df2d6b970ddc599de3e69248966ee	2026-02-11 19:28:55.781+00	f	2026-01-12 12:28:55.736427+00
a3c82b85-f7ff-48a7-b4c4-c5709547afce	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5d562a9dc9caa12b31ba86338748dd193b2bb3b18c7968e430bb4f0a8f67fce6	2026-02-11 19:28:42.397+00	t	2026-01-12 12:28:42.32814+00
9bcdeb9f-c30f-4657-94b6-40c06b8dc716	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6cd16d4c524add7a1a89fd483ddf25607020061ab7dc98f6315046fa38f03700	2026-02-11 19:29:12.592+00	t	2026-01-12 12:29:12.545572+00
9f933b99-3c68-4191-bd32-d9967bf017d0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b6880d26a13ae9000032f180de2ceaa7866966917cda8ead7b4d6bd73b655cec	2026-02-11 19:34:42.42+00	f	2026-01-12 12:34:42.377467+00
d0e24c14-9086-458a-af2a-725ac2166411	daa74fd2-afa3-408a-b50b-f1ffa476d608	c81273c2efeb20fee977d946dd42ee78596bb2f0f082eb9d98814491ddbe41d5	2026-05-28 08:39:49.181+00	f	2026-04-28 08:39:49.746941+00
861b8c3b-48e3-4ef3-9cfc-afb65c4e7e09	637ad6c2-4ebe-4a34-9dee-4069973bf704	9b3fa2793ba45df0c91809067b2a5a93852b2a5d7fbaf047d7dcfb46807715c4	2026-05-29 09:28:55.703+00	f	2026-04-29 09:28:56.403368+00
41775799-ad0c-4dec-99f3-142a1bd71abf	637ad6c2-4ebe-4a34-9dee-4069973bf704	982ae142027d9759f3d59e48a41251ed5d990aac5449223bfd9806af19983f1d	2026-05-29 10:20:06.11+00	f	2026-04-29 10:20:06.841014+00
fc61ee6c-3ed6-4645-a1d1-9e1eaf47a74b	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	9c1e677f13d36f4796cd1abc6685f2b2694d952c234d56b9bf2708d2d4d44b8b	2026-02-11 19:46:06.892+00	t	2026-01-12 12:46:07.392425+00
3ea5de8b-b172-4df2-b37e-e64520a6c250	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	68a6977f5dfa4e7cd4f523d4bc9b11f057ce65bc89dc4824fa514c8b2add2403	2026-02-11 19:58:37.282+00	t	2026-01-12 12:58:37.811505+00
7b0a0782-890e-400c-849f-dc2f7010f291	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	31146843b5002c5bd8f6045cc89e727509d5c25dce39c0ed795e4ea4a57c5f86	2026-02-11 20:04:55.547+00	t	2026-01-12 13:04:56.079423+00
e2cf6bcf-0d21-4cd4-ad30-3f1bfe65bcb4	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	f4d1f5aa24087893016f16323554d5b2a6c3806b156d7825217e8d647586a634	2026-02-11 20:16:18.631+00	t	2026-01-12 13:16:18.214311+00
6f787392-9dc8-4337-8ab9-1ade9ea5f1ef	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	60161972d5e111b99b96695bf43f54d4ae14c3f416a3c856a7399d7f009ead65	2026-02-11 20:16:27.363+00	f	2026-01-12 13:16:26.94441+00
05edec3d-a022-434d-8383-db1db6779e2a	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b6880d26a13ae9000032f180de2ceaa7866966917cda8ead7b4d6bd73b655cec	2026-02-11 19:34:42.42+00	t	2026-01-12 12:34:42.376414+00
ade13ace-5e1f-4aaa-abf6-5e87d76e6abd	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8d0cb609cff9839282577445702e857cc46c0579546071ee506403e769354a1a	2026-02-11 20:12:52.018+00	t	2026-01-12 13:12:52.564239+00
c25b9a4d-1d66-4e42-a789-e539e2cc8b7c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	640ee40f3fd286a9405107baa0ca0743ec02bee79abbeea69b75559530c8742c	2026-02-11 20:18:29.151+00	f	2026-01-12 13:18:29.712154+00
d793db39-1228-4d8a-b86d-ca22a2a666c9	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	640ee40f3fd286a9405107baa0ca0743ec02bee79abbeea69b75559530c8742c	2026-02-11 20:18:29.216+00	f	2026-01-12 13:18:29.753646+00
4aa3bbbf-248b-4c0a-b05c-f27609a1f480	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	44c1e15afa11022c5fc9a7185cc46b2cb9f8123242f3c68f6a6f5c10c696f6a2	2026-02-11 20:18:54.125+00	t	2026-01-12 13:18:54.675217+00
948d644e-ab96-4fe7-ac1b-4ab1d31a515c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b1f2d826655d4ed9f16ad9ac253c4a1ba5cf969d9a06a708d0e7de68d1076299	2026-02-11 20:25:48.98+00	f	2026-01-12 13:25:49.514957+00
7f554bfe-3c8b-41fc-b592-51d370a4437c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3ab30f83d7e8c23b4e0db26890cd8459e8b8e2e4f61d51c26d476bf5d375b4cc	2026-02-12 00:14:07.962+00	t	2026-01-12 17:14:08.430654+00
553f0b49-4520-4f3e-a72a-51204d9e2492	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2ef142b34f21d42dd9a51e2b77d4afa2c5b331d50e1eeb15c16ac634799b52b9	2026-02-11 20:25:49.33+00	t	2026-01-12 13:25:49.874958+00
4d4fc97a-fe68-475b-8cc2-8976a7fab626	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ec5c554c8637a654b84f8af5097f59efc7bf344e40ba297c39035e1d6b3b4390	2026-02-11 20:36:35.594+00	f	2026-01-12 13:36:36.147048+00
71dfe7e6-7fef-4847-9c83-bc503e5dcb5d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	856e66505e01bb0a0efd466333a4d75176e823de2ae5de2b2ab5920ba21f1110	2026-02-11 20:31:28.242+00	t	2026-01-12 13:31:28.185546+00
a150ee9f-8797-4b7a-ac94-5e760088be7e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	9b29e9a64e54df88e92423b81c611581dc00630feed5d73bee7438a36d04a70f	2026-02-11 20:27:48.681+00	t	2026-01-12 13:27:48.682264+00
edfb1a78-2ec3-47bd-b02e-a9716a32d692	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	76fb7b64c0ec357df557d8f011b614c1854a382282c300cf66f0a3180e009550	2026-02-11 20:46:40.338+00	f	2026-01-12 13:46:40.302415+00
a5c9e831-de6b-4b9f-b0c1-42bb5d69b695	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ec5c554c8637a654b84f8af5097f59efc7bf344e40ba297c39035e1d6b3b4390	2026-02-11 20:36:35.593+00	t	2026-01-12 13:36:36.143338+00
b3992d18-0c64-4b62-a00a-41312d7fca21	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	42cc2bfb20c99d82c42752d0141b07bd6beb342fcfd8db3ec2d9aaa3753298aa	2026-02-11 20:47:18.085+00	f	2026-01-12 13:47:18.695571+00
ffb63a76-c0b5-4437-8d91-ed187fa8da45	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4d8a377577b6f55547181da5d878ee57b3b5b8ce04eabea02b917819f1401d22	2026-02-11 20:39:35.495+00	t	2026-01-12 13:39:35.527408+00
e74a5ae3-81ef-4e32-8193-4d5b18fc0758	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2722e1c72f13e9b0e95fe8d3baa400a3ed2718fac1958b9dcd7230ea97a6b637	2026-02-11 20:48:33.223+00	t	2026-01-12 13:48:33.194827+00
4e48ca84-adc9-4405-85e3-30185d826f76	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2f1eca85c2c8f01b59a014b49ce3bea277e34052d80e47892f696cf17754a0c4	2026-02-12 00:24:45.974+00	t	2026-01-12 17:24:46.439152+00
57ff06fb-a1d7-43c5-8d77-7a1f194de271	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ff33057812877bc17f7b4e328b916057b30fc22ecba2c36278f978cfb4135ded	2026-02-11 20:57:11.927+00	f	2026-01-12 13:57:12.499751+00
d4781ee8-9306-4f28-a332-1e1505f5afca	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	42cc2bfb20c99d82c42752d0141b07bd6beb342fcfd8db3ec2d9aaa3753298aa	2026-02-11 20:47:18.095+00	t	2026-01-12 13:47:18.694642+00
49fce73f-99b0-4d5d-9b52-539a44dbd053	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6237b32c723dbcea62966ba0a59a883351160cbe3e3e850a6c8e121dc28c2559	2026-02-11 20:53:39.992+00	t	2026-01-12 13:53:39.960621+00
20d78d40-4fa4-4bfa-abb1-a9c44ac3f38e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	64614a8b566b1fd5d310959263162da10f86f4710d3aeda757f5e1f61ec5b5aa	2026-02-11 20:58:51.032+00	f	2026-01-12 13:58:50.9944+00
93258976-93cc-444d-ae75-db1c19ee8401	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	652e68a8b70b32de16a45c5c2baf64ad7cd405354b19dc34a5809aafb6ba7cbb	2026-02-11 21:01:53.135+00	f	2026-01-12 14:01:53.115716+00
e1f17ee6-ba15-4aec-82c2-dcc655361524	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4d8a377577b6f55547181da5d878ee57b3b5b8ce04eabea02b917819f1401d22	2026-02-11 20:39:35.683+00	t	2026-01-12 13:39:35.717603+00
52821304-2620-4b25-9bbb-2409ea420978	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	06c2ed669d0ae0bfa4ab2bf10e7f33f8e34960803dc7a0d08cec1f1b1bf79af4	2026-02-11 20:57:12.074+00	t	2026-01-12 13:57:12.666548+00
90a0458e-048f-4a85-bb3b-928e3d40b16c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	489f88cc69a4d44cc0eaa3d64cb3404f7c3da9c0955b1898f87a070bc5448ac6	2026-02-11 21:12:48.19+00	f	2026-01-12 14:12:48.77893+00
a989e22f-32d9-4ee3-bb8a-328cc40c453e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	81430328c22c4ff799bd0fdc9f92577a992562188b1888cbf9c4ea2c537e6aaa	2026-02-11 21:04:15.087+00	t	2026-01-12 14:04:15.06451+00
4f97170e-4154-4497-8826-7df23f3e39bf	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	45f8bcf1299c6471f591c24e327dbb91f18ea95cf2166ed9ef8e6ba867200b05	2026-02-11 22:01:09.483+00	t	2026-01-12 15:01:09.980837+00
0ff40a33-cb5c-4918-87ad-7f9f287eb58d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1dd80a95db5eea5c482d1670ad7810d9804939b7438cd894d3c81ab12371900a	2026-02-11 21:15:57.424+00	t	2026-01-12 14:15:57.394873+00
f980e648-7033-42ce-8966-c236ae18d022	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e4f8fc14f51d68a98483d50e9713fedb1f9214fdbea31e32226f78e5682cc61c	2026-02-11 23:24:24.457+00	f	2026-01-12 16:24:24.905878+00
7f421370-5144-44c4-b4aa-2b040ffbcc06	daa74fd2-afa3-408a-b50b-f1ffa476d608	0de01f9cffdafe79e3eba4d3a438baa3caca6150b1f7792ba983f1a2060e6d03	2026-02-11 23:26:05.843+00	f	2026-01-12 16:26:06.287002+00
ea8c5b64-da17-4843-9385-5c1d9824d72d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	701c8abec6f66144c227aaedb666a63f2dbb8660b86b3aa9e1588ba4e593ed17	2026-02-11 23:16:00.274+00	t	2026-01-12 16:16:00.722338+00
9a8715e1-7686-4ce2-8857-fed8968f6518	daa74fd2-afa3-408a-b50b-f1ffa476d608	e0a8dd54b85c29ffcca2e2c1ca0c7ccded2469f4e65e24debe09c4870075f7e4	2026-03-04 09:30:32.158+00	f	2026-02-02 09:30:31.300801+00
5d4c1033-07a2-46a5-a2f5-cc3439f12728	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	385be57105e16e4ff4e84c73e483aa4cadb715a1cc3ad6ce35f2dc94dcec57fe	2026-05-28 08:46:45.137+00	t	2026-04-28 08:46:45.704653+00
7f7389ff-2601-4464-ad63-210cc78a0059	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c55c15f65334e4b777cc41989b093153f2360704fd108d2e05b2b19a44e7d646	2026-02-11 23:21:45.789+00	t	2026-01-12 16:21:46.238126+00
e09e042a-a64e-41d5-8733-d7888f14fb09	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a8961c04ad57d18f67e21820780f728cbaa4061e42921a1123d9c35271aae1f6	2026-02-12 00:30:56.365+00	t	2026-01-12 17:30:56.832338+00
67a615c4-70ff-4043-969f-05874ed5501c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2ac84548ff9cad7688ede125f5648488b2231f2c96491ae29834bca568fc9d00	2026-02-12 01:04:39.277+00	t	2026-01-12 18:04:39.755933+00
d98275db-c5ee-474f-943f-c35a71cd90c2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	97a7a0e68e31e582017b0ca89ca6767c74aad6e2b04ef08e49ef596683c4ce88	2026-02-12 01:16:09.403+00	t	2026-01-12 18:16:09.897427+00
9eb721ae-d468-4112-8818-9c0894d81e63	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8e99e8b8885251b7d562ff4c36147a646ae9fc34c11db1181db46599ec740d51	2026-02-12 01:21:16.513+00	f	2026-01-12 18:21:17.008039+00
9b43f5ea-d7e9-4565-a696-1b7d8a765370	daa74fd2-afa3-408a-b50b-f1ffa476d608	9d218e00c1be5acd1379eb163405927ccbeaaf91c4e98874410f0e9bc91a39a9	2026-02-12 01:22:50.846+00	f	2026-01-12 18:22:51.338851+00
d89b4e88-dca1-476d-852b-c39a179d963a	637ad6c2-4ebe-4a34-9dee-4069973bf704	cb72fbd3655e094818d4bbc5db4c0b902d805545f512f180aa42f5fb56a49274	2026-05-29 09:29:38.993+00	f	2026-04-29 09:29:39.6994+00
29c6fcbf-3f8d-4e20-92dd-f28982efaa8a	daa74fd2-afa3-408a-b50b-f1ffa476d608	43e7e149dbffb3ea01da3ee8f02fbf7fcac272e237410d089967dc878874575f	2026-02-12 01:27:06.726+00	f	2026-01-12 18:27:07.22889+00
fb127ee1-7458-4f8a-84a6-7995135efc4b	daa74fd2-afa3-408a-b50b-f1ffa476d608	d2c632e49a8c95f014f7990784728bb293445fe081b39d5c3a0728f696ea582f	2026-02-12 01:28:33.543+00	f	2026-01-12 18:28:34.041274+00
33d1e41b-f672-47c4-a010-5b5567abbaad	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	29c27444dc61b91fece6cabb62eb98afe76a3bd1e61af93716bc96091e65d757	2026-02-11 23:27:33.187+00	t	2026-01-12 16:27:33.625384+00
f68510aa-8b2c-472d-a8ee-75d9e83b2559	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ace6c7723d4ba9cff78b8a67e41cc5dd72bf52002ccfbb6c816b551a532ba809	2026-02-12 08:46:29.766+00	t	2026-01-13 01:46:30.413929+00
d59b4f53-da23-4c07-a3a4-0606547fa990	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	12b015e463f9dd3e867da7b1c5987ca2a014fb4bb6de6ba5da6d8fbb5b168492	2026-02-12 08:47:05.538+00	t	2026-01-13 01:47:06.186107+00
2e35321c-d963-471f-b91b-78999d11222d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	edbc52651cccede501bd954259773f40aa4817e9d0ac0d61cbf4974a836602a3	2026-02-12 08:47:17.733+00	t	2026-01-13 01:47:18.38005+00
2044fd87-4e39-45a4-9f90-ce6fd695bba4	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c273cfb1e8ae93aa3e7d08790af8a72e942dd50002d3e60cacf68e7cc8263991	2026-02-12 08:47:27.236+00	t	2026-01-13 01:47:27.882297+00
466dd9b4-e21c-44ae-b74d-8f39a9c86a25	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8175d068b391a3f6da1c96688a0f50859aad5df18e9aac6e9e6d41f22f3bdf9d	2026-02-12 08:47:35.095+00	t	2026-01-13 01:47:35.74356+00
22f8b82c-9a9c-4dd0-ac54-728fc50240bc	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6f876e918185aa416d40fc4d196f16afffce03bcd1e6e57fe7668204ba786b2d	2026-02-12 08:47:38.412+00	f	2026-01-13 01:47:39.059666+00
637dff7d-31f5-4b02-99da-d0b783bd8520	637ad6c2-4ebe-4a34-9dee-4069973bf704	9c9e79e6a2c334d7bfd589f83c63d56b26ed92ca624a0a97f11dca7cd825531c	2026-05-29 10:22:03.149+00	f	2026-04-29 10:22:03.880417+00
1bbf15eb-9b20-4ef6-840e-69461f702b8e	637ad6c2-4ebe-4a34-9dee-4069973bf704	3141fdbb1076510549b9cff7265c9706a3052fc2d05c97b07c47466100c424b7	2026-05-29 11:43:58.982+00	t	2026-04-29 11:43:59.384727+00
642f8d65-8faf-4f2f-a121-2d36a54b5db8	637ad6c2-4ebe-4a34-9dee-4069973bf704	20aa3817f5998c0807e03bd207f4a247f23d7e7ba14317974bd4b87a058d1b0d	2026-05-29 11:43:59.371+00	f	2026-04-29 11:43:59.772778+00
a91edc7e-29bc-4994-89ba-45bc3e7c486b	637ad6c2-4ebe-4a34-9dee-4069973bf704	7b7d05b90c2bf5c51049cc2d017f9f85cc6265bb620171ea36bb1e9acd9f76d8	2026-05-29 12:45:40.265+00	f	2026-04-29 12:45:40.699249+00
22c98128-de64-4953-9622-553d03acce4c	637ad6c2-4ebe-4a34-9dee-4069973bf704	85ff0c67a24304df33d9577513e7f64380a342bc882963aeb495f9b9bcbebbde	2026-06-03 07:18:56.257+00	f	2026-05-04 07:18:54.799214+00
6d6decaf-f27c-4fc3-9310-6f8556278283	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	bc0c85e973de84052dcc9324d831d575adb5be9ebabc7b247e907dfbaec5ee9d	2026-02-19 13:57:23.939+00	f	2026-01-20 13:57:23.965229+00
5fff006b-772b-4bf8-a444-68534997f1c2	637ad6c2-4ebe-4a34-9dee-4069973bf704	e8d26af08d27c4d3ccda3a7a04ff0b912e03d03edcae8e20d9591eeeb1eae5a1	2026-03-04 09:30:52.198+00	f	2026-02-02 09:30:51.346915+00
3488219b-e4c4-46a8-bc76-fd731c6b9de1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	25cdbd56d68f44404cb0278b48faff3d6df35e8ad8abc9b1648cacdc1224239f	2026-05-28 10:09:31.126+00	t	2026-04-28 10:09:31.741515+00
686fdfb2-4882-4134-8d58-c4633cb05df7	637ad6c2-4ebe-4a34-9dee-4069973bf704	62c14f703956e5c0d884cef43f461097da2b94195db4f092d8b34bc288b22e97	2026-05-29 09:30:01.013+00	f	2026-04-29 09:30:01.719763+00
20c34084-16f1-47c7-924c-8d9be53f371b	637ad6c2-4ebe-4a34-9dee-4069973bf704	b9299baea1a0488f8302704864a12bb7a567c2b1f701d659a8c200261ab878f3	2026-05-29 10:22:54.251+00	f	2026-04-29 10:22:54.98246+00
4eb22bfb-c4e0-4e60-b099-003719608069	daa74fd2-afa3-408a-b50b-f1ffa476d608	1903640d004e5aa2ed6134c19b3ad04e362d5774e2be16e601c8d95a3cc8473e	2026-02-12 13:11:38.337+00	f	2026-01-13 06:11:38.397948+00
1aae2c60-6e0b-4465-8432-a870a6c1ee83	637ad6c2-4ebe-4a34-9dee-4069973bf704	4d6c2fac13fe425b821dfad60c5958d5dfa3ff9a93d0a3f227399c06f240bc2d	2026-05-29 11:44:36.27+00	f	2026-04-29 11:44:36.670527+00
87f5a666-3b07-487d-bd62-8a43b998ea68	637ad6c2-4ebe-4a34-9dee-4069973bf704	28b73c9971b1c0765a3a80407a771fa023c86441658bcfd231bfc1f6a0dd5e65	2026-05-29 12:56:10.312+00	f	2026-04-29 12:56:10.755182+00
90118273-fa37-4a35-87ac-f0ea5cd8d2b4	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	89fe84fb61b7a7d662686e238956956d0def53f4e482279e3e9901bad9b973c4	2026-02-12 13:34:24.551+00	f	2026-01-13 06:34:24.624261+00
eb80388b-84de-4883-9e5e-be9ec41cf722	637ad6c2-4ebe-4a34-9dee-4069973bf704	c417920797cf9449cec82c865746e93232c9e0395e62973f271867418426e938	2026-02-12 13:36:00.793+00	f	2026-01-13 06:36:00.867097+00
6bab9cfc-81b9-4a75-98b2-064b4732415a	daa74fd2-afa3-408a-b50b-f1ffa476d608	9f026c840d5d6faf0d001590f2f184dc92ffe628907e8b953f0c272a200ac8ae	2026-02-12 13:41:11.389+00	f	2026-01-13 06:41:11.465105+00
e24f12b1-38d1-4342-94fa-e925ec4e1d95	637ad6c2-4ebe-4a34-9dee-4069973bf704	a05e5c83100d26990ce8edad82e68149b94696659e63c12dabdba2fb1f34bed7	2026-02-12 13:41:48.109+00	f	2026-01-13 06:41:48.184742+00
53d4bb2c-ed8d-4981-b135-563f62299521	637ad6c2-4ebe-4a34-9dee-4069973bf704	4102ceecda97cae055c4358a54fcc42a3a6023afcbfa64330a949d17c21f1ad7	2026-02-12 13:42:22.886+00	f	2026-01-13 06:42:22.961937+00
22dd4cd4-2d97-4cd3-a537-59b4ec0d12a3	637ad6c2-4ebe-4a34-9dee-4069973bf704	ce592f2135ad22ac3fde4069f612acb52e42e99db473e54705db639d4c3faced	2026-02-12 13:51:48.921+00	f	2026-01-13 06:51:49.000184+00
f7da4381-0689-4e4e-adca-810789658d20	637ad6c2-4ebe-4a34-9dee-4069973bf704	6305ff09e1ebaa2d969f606f59e22d39b3a1697024f5c5e8522f733dc49223aa	2026-02-12 13:52:48.882+00	f	2026-01-13 06:52:48.962516+00
2dcc44f7-9878-4360-aae4-08caba51bbb5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ec2da8d4aa0991c83cebc3ee37ca98bf2ad0dbc6a5fdd2b76ace168a39b8c640	2026-02-12 13:41:15.01+00	t	2026-01-13 06:41:15.086145+00
87a5c421-4746-425c-98e3-820f4d8f07d1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	de6644a19ca2aa3dad7f6145609c1504afe8b05f7d036e5de325bffc70b17f17	2026-02-12 13:57:45.738+00	t	2026-01-13 06:57:45.819687+00
e2fc99f8-67a0-4294-a038-05a85d0769e2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2ec1e2f8e531d65e31103b41d3c3d0c74102f894b11e753848bc945bfe6d3a43	2026-02-12 14:03:04.807+00	t	2026-01-13 07:03:04.89135+00
57cff003-9a0d-45fc-ade3-69014f9c87e5	637ad6c2-4ebe-4a34-9dee-4069973bf704	9383db8ca93bea6e95d811b8389b9947df277987bb81c6c64f74f86892fa1197	2026-06-03 07:21:09.628+00	f	2026-05-04 07:21:08.170703+00
4593dae7-f74f-49b9-b37b-0e33f88272fa	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	96e0444e8959fd68754d94bfea0eb92ed4094b992f34788a73790fc957590352	2026-02-12 14:43:23.641+00	t	2026-01-13 07:43:23.758594+00
7c42bc27-dfd1-4304-8785-a14f37798e08	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	d58bd9f234388ab99dbf0313d4ee0ffa220c385445d7334d91d506d67fa1cfe4	2026-02-12 17:53:49.192+00	t	2026-01-13 10:53:49.404969+00
3b080319-41c1-4633-bd07-df088cb338c2	637ad6c2-4ebe-4a34-9dee-4069973bf704	f7e72c85db23992115320e0dd42f1ff1bb4c75a2c36dedd973ecd1fcd1d4680f	2026-02-12 19:59:06.701+00	t	2026-01-13 12:59:05.539093+00
fd3c557f-a589-47bb-8636-cd4ed7b53a1c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b074622a76944c4bf615b58358de4725cb0cad30dc12c8743fb4af51ba45aa41	2026-02-12 18:18:32.946+00	t	2026-01-13 11:18:33.166784+00
f89f6899-6857-45c7-9139-65b816c5635a	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	acf66bbb67767c1bc408e152837350eec815ff7abb345b1ce2ed3f45865ff91f	2026-02-12 19:31:34.427+00	f	2026-01-13 12:31:33.252057+00
7b107b26-f184-44eb-823e-28e359782c75	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	47869696d52820e5c604081100679c2e299d2fe95dceebf0392cf8c23f410dfa	2026-02-12 19:41:47.339+00	t	2026-01-13 12:41:46.183126+00
be351d10-ac68-4efa-a521-e8a67a5cee38	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ec6a96ce8231ad6c4c816e0ea01005651f4c8e13031f3674a50154ca516a9bde	2026-02-12 20:11:52.862+00	t	2026-01-13 13:11:51.712263+00
f0afc31a-48ca-43c3-b29b-ecc76470dbab	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	57f511222ed2960189e759c9840547c407abdd3d68d25fce51d0a965505378f0	2026-02-12 23:41:18.329+00	t	2026-01-13 16:41:17.93429+00
e7765ee9-59aa-47eb-964c-65fa77b42b94	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	17fbeb49d0b5e826ebd83afedd47a790ba8b109dcab0e53b32f5a0d76d17b4a3	2026-02-12 23:52:07.026+00	t	2026-01-13 16:52:06.54765+00
879722c5-8d2b-4dc5-a4a3-2ba02f20480f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b0457f5e8a97d6f8588d94dc49e4717b89d0c7890a7f9026110b1a97b9da0b92	2026-02-12 23:57:58.865+00	t	2026-01-13 16:57:58.392064+00
f65c92ee-33d3-499c-b0a3-b59878ba80dd	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	17b9f14312364dbf7f7f8be786f3fc9e7c4b3e86b400489439df11c8423f5f5a	2026-02-13 00:04:03.787+00	f	2026-01-13 17:04:03.320711+00
da344382-adaa-4205-8f99-04b121bc78aa	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	877e0d97d931abaaeb92d1d8018ced1ebadb67e3de241a9f900a383e0932f7f4	2026-02-13 00:07:31.129+00	f	2026-01-13 17:07:30.666179+00
7c8f02e3-1d1b-4a9a-bd80-1daca79acdbb	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	9745d1611eda30c9e89416bd2980e33825a281b31a2ac90bf79598a58abd9e3f	2026-02-13 00:09:28.331+00	t	2026-01-13 17:09:27.870935+00
7237fc21-befb-4950-9a1d-cba8adf7dd26	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	062f00cce5bb7d15a27a50ae8796c8fe19267463d4f50c951acca60fd7fb04b4	2026-02-13 00:44:49.539+00	f	2026-01-13 17:44:49.109821+00
02dd9845-c66f-4ee2-9bc5-18f6616a0976	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6432888748d233ea31a10d7213d3910ed897997519e81c6361628b4f14ea2a30	2026-02-13 00:51:16.197+00	t	2026-01-13 17:51:15.776097+00
49fa7a36-25b3-4662-a5a0-687fb024a16a	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2d1fedd9b58b50e691928bab9497e0c4303e7f58fd25962522ff72181fccdc25	2026-02-13 00:45:14.185+00	t	2026-01-13 17:45:13.758242+00
39035ddd-5ed6-49c8-a9f9-f4e057187ba8	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b05154d6a7262a0d63092cda32cea02e0de329386bde04a2ac4ef108ffd94e43	2026-02-13 00:56:17.518+00	f	2026-01-13 17:56:17.107919+00
983fdf11-359b-4053-8e2b-cf2be1685db2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6432888748d233ea31a10d7213d3910ed897997519e81c6361628b4f14ea2a30	2026-02-13 00:51:16.195+00	t	2026-01-13 17:51:15.775831+00
28e6bf06-fd38-47fa-aa6d-dc30525d46e3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	cef117bd2e2aaa3b5560fe23a9120c1a375bef05d8a16c96d9f5cf99dba628e3	2026-02-13 00:56:18.875+00	t	2026-01-13 17:56:18.458867+00
293ce361-47d1-4c3d-b3eb-cc40662314ff	daa74fd2-afa3-408a-b50b-f1ffa476d608	8ade625afccff6c2dcc924c1c1e83267fb8107fcfab051ac7189a1e5fc59602a	2026-02-12 19:49:29.25+00	t	2026-01-13 12:49:28.084719+00
3be4e1e5-f328-4f5e-9e22-9afb9328ff33	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	63fe98685a690b901724b95f00d97ca7c5ec8e54dcf740dc51440592e5ed5d24	2026-02-12 22:35:50.459+00	t	2026-01-13 15:35:49.399035+00
67929aa9-4297-4a82-8551-95980f8648e4	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5f4ca598eff87419298ff0d77db3ba6232c6e7ee028a30574586c11ef02a3fb3	2026-02-13 01:02:36.663+00	f	2026-01-13 18:02:36.290435+00
51201a80-fa95-455d-b54c-ef1467d00875	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	17c7cbce3520b773ef6076b734c5cfd554094c4bc04f25bab2c4606f7c4bd7e3	2026-02-13 01:05:15.586+00	f	2026-01-13 18:05:15.223619+00
3bd6259a-955e-4b89-b087-3db04b9f9795	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	504edeaa6afb57dd8829c8c8010b16db75b4636a4092b422ab067923f2695940	2026-02-13 01:02:30.23+00	t	2026-01-13 18:02:29.828841+00
c7eaa488-73c0-4228-8b39-5e0e778d29db	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fe31daaccfdf365b2f49858c264c7eacc2e4a696fa505172a72369b0d8663696	2026-02-13 01:08:43.573+00	t	2026-01-13 18:08:43.176472+00
5fe1812d-b0f5-4926-ac5a-472064664c85	daa74fd2-afa3-408a-b50b-f1ffa476d608	8c416844b2776d3ebe578561b6d1539648aaec40826c3e8fd03a98a1d4d91f18	2026-02-19 13:57:39.729+00	f	2026-01-20 13:57:39.760055+00
d4439ae7-13d6-4638-bd94-58386688e988	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	97bf9573373c99d65c6dfa0125596609abef81bafd71a0cce8300531a75b95e2	2026-02-13 01:13:58.259+00	t	2026-01-13 18:13:57.910646+00
d0090548-b15f-4751-905a-1beccaaab3dd	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	f0bc9bf201b4a32c4bd8e37116caa2a461c7bc9b16dbc79d0347800917a38212	2026-02-13 01:19:57.498+00	f	2026-01-13 18:19:57.107685+00
53446b76-3bb0-4a60-8f26-d8b42bc0ffdb	daa74fd2-afa3-408a-b50b-f1ffa476d608	09b49f3d44b415bd2609c12c1732e4f5cec2fe5116f179fee8874e2f7981a1da	2026-02-13 01:21:41.8+00	f	2026-01-13 18:21:41.447092+00
1882bc4d-8c26-4c03-8ae1-ee38575e07fe	daa74fd2-afa3-408a-b50b-f1ffa476d608	e0d07530abb2ae0256b61287193e3ab1f16d8f90acf0b1c14fc6ace269d87dd4	2026-02-13 01:22:39.691+00	f	2026-01-13 18:22:39.33462+00
a3cacf8b-f449-4abb-913c-413cf92434a3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5e7efaadcda2cc86bc2acf0106ca23618c473f36dfb1927c5cbac2df6523fe78	2026-02-13 03:39:38.712+00	t	2026-01-13 20:39:38.445572+00
fade452e-4366-4be9-b620-f5a5e005004a	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0d03c68eebf223c3a0a1a87cc945bb192d81ca997aacecc07f4be1388b3b2b87	2026-02-13 03:46:06.271+00	f	2026-01-13 20:46:06.007854+00
3c921458-7cbc-4cd8-a109-7e98ee222af0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	f0bc9bf201b4a32c4bd8e37116caa2a461c7bc9b16dbc79d0347800917a38212	2026-02-13 01:19:57.497+00	t	2026-01-13 18:19:57.106702+00
1b6dfb1a-6084-40f6-867a-83ccebf68e66	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5797ad0f6e350dde8f6f0bb303cecbf9884ec9ab88cce105ec33b758a2e9efdc	2026-02-13 01:25:51.806+00	f	2026-01-13 18:25:51.41775+00
35f1ec05-22a3-4659-a7b9-21d8cf70306f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5797ad0f6e350dde8f6f0bb303cecbf9884ec9ab88cce105ec33b758a2e9efdc	2026-02-13 01:25:51.989+00	f	2026-01-13 18:25:51.604124+00
1773dba7-074d-4407-ba96-bdf01db6868c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5797ad0f6e350dde8f6f0bb303cecbf9884ec9ab88cce105ec33b758a2e9efdc	2026-02-13 01:25:51.99+00	f	2026-01-13 18:25:51.60444+00
b01f61b6-97a5-4ce8-8586-c9ab319dff47	637ad6c2-4ebe-4a34-9dee-4069973bf704	ff7e051fe3644eae24ba3b0fceaf7ec44eff8bd040e8c64b8ccabd28361e5c31	2026-03-04 09:46:18+00	f	2026-02-02 09:46:17.965654+00
9a7eac54-f89f-4969-801b-e445e595a11e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0d03c68eebf223c3a0a1a87cc945bb192d81ca997aacecc07f4be1388b3b2b87	2026-02-13 03:46:06.266+00	t	2026-01-13 20:46:06.006241+00
e0785e54-6b7e-45d7-beba-62ec80c5b7a0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5797ad0f6e350dde8f6f0bb303cecbf9884ec9ab88cce105ec33b758a2e9efdc	2026-02-13 01:25:51.805+00	t	2026-01-13 18:25:51.414875+00
7bb60f72-057a-4d1c-84cf-767e98924d7d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c57c11279596d7530d52ecd4fbfe553992cb0e3dd0cb81601a86160541924490	2026-02-13 01:32:27.323+00	f	2026-01-13 18:32:26.944787+00
9683a40b-acfb-4f4e-9abf-6e4282bbbff1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c57c11279596d7530d52ecd4fbfe553992cb0e3dd0cb81601a86160541924490	2026-02-13 01:32:27.322+00	f	2026-01-13 18:32:26.944495+00
8df9d287-19a2-4028-b576-7194409dc718	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c57c11279596d7530d52ecd4fbfe553992cb0e3dd0cb81601a86160541924490	2026-02-13 01:32:27.322+00	f	2026-01-13 18:32:26.945789+00
59e17b13-dea6-41f1-90c1-7a45132c5595	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2ed1fc7ab12a6cb8fdefa3cb7bee614bdf6869f3ce06576521f0bbe9404fb15e	2026-02-13 01:37:16.199+00	f	2026-01-13 18:37:15.852197+00
3b56aedc-a868-4518-a46b-5ac94224db3c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5566022ac3359ed4e983c437e29aefeb99c42df8d5073ee98af8c13b3e4da9e8	2026-02-13 03:52:27.455+00	f	2026-01-13 20:52:27.202466+00
66ad8ba6-ac5c-4163-9d25-c94b373d8a65	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c57c11279596d7530d52ecd4fbfe553992cb0e3dd0cb81601a86160541924490	2026-02-13 01:32:27.323+00	t	2026-01-13 18:32:26.944566+00
0b07d9ae-c4d3-4cb0-9961-2e02ace87e83	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	35c3e9eb93d7d9c462f4ce7f05e0f04630b1f3319336136c601ec5c882c97bbb	2026-02-13 01:42:55.565+00	f	2026-01-13 18:42:55.199185+00
6311b2c6-f76e-4382-af6e-836e381b9377	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	35c3e9eb93d7d9c462f4ce7f05e0f04630b1f3319336136c601ec5c882c97bbb	2026-02-13 01:42:55.566+00	t	2026-01-13 18:42:55.19918+00
661575c1-c574-42ae-8e08-6942553f1972	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	63e5ed0e9969448d7d0aedf19960bee289fa1f4bfeb360a5433e5317541deb0b	2026-02-13 01:52:50.633+00	t	2026-01-13 18:52:50.275414+00
66e58a3b-98b8-4f4d-8799-6d4d8ec1313e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	7571540ac5d672d77c0156cf74ca4c561a123e1e1be394816475b04ff87c0ca1	2026-02-13 01:57:53.758+00	f	2026-01-13 18:57:53.478073+00
664894de-2742-4b6b-bcd7-b24f4271bcc3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	63e5ed0e9969448d7d0aedf19960bee289fa1f4bfeb360a5433e5317541deb0b	2026-02-13 01:52:50.633+00	t	2026-01-13 18:52:50.275848+00
ec35370a-5535-495a-87db-832e1859262d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3ca21b4b7a056c4648a0b710007325dbc945fcc5a41bc67aafbc338f728d9ef4	2026-05-28 10:42:08.067+00	t	2026-04-28 10:42:08.702236+00
7bdf0b38-28d5-48f8-88b9-03fc9273b8c6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e113b439eaa7811ca079359423751c8c6bb7b9f9133435c9e15d17cb9c9faeb4	2026-02-13 01:57:54.614+00	t	2026-01-13 18:57:54.261681+00
ecb854d1-beda-43fd-b5a7-d27d4c7adb4d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fd47286c27dd2eef9e5e81178e3402b165cf60a70562df556ce28b3a9e42d4a7	2026-02-13 02:03:05.644+00	f	2026-01-13 19:03:05.303389+00
f57c641a-83a4-4aeb-9ab4-54bfa3fea6ca	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fd47286c27dd2eef9e5e81178e3402b165cf60a70562df556ce28b3a9e42d4a7	2026-02-13 02:03:05.741+00	f	2026-01-13 19:03:05.397736+00
c65e761b-03e2-4842-9b25-dff614dfbd52	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	719f5abbe6d67a24b483f4654b69715cabaed095959141ef30417db6f4b7a3e5	2026-02-13 04:20:47.727+00	t	2026-01-13 21:20:47.541874+00
1d00c49f-554c-4c96-a08f-fb6756a9ef05	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1fca377903e072104aae9c809dc68f535602f95fa8731da4eabb7f3c547848b7	2026-02-13 03:29:22.903+00	t	2026-01-13 20:29:22.62668+00
7a054d9b-171f-4f67-95f9-470c6f8ec4ad	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5e7efaadcda2cc86bc2acf0106ca23618c473f36dfb1927c5cbac2df6523fe78	2026-02-13 03:39:38.711+00	f	2026-01-13 20:39:38.441838+00
4a8d6e55-dc7d-4433-a556-f879eec48e23	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5566022ac3359ed4e983c437e29aefeb99c42df8d5073ee98af8c13b3e4da9e8	2026-02-13 03:52:27.452+00	t	2026-01-13 20:52:27.202417+00
7be82cb2-9ddf-4a0e-ab4a-9c0679e19fc0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	94a74c9da1de74fdae59b448c751491cbede8377b950d2b704a65596b4ce9594	2026-02-13 04:07:05.991+00	f	2026-01-13 21:07:05.750042+00
d72b7ec7-03e8-46ee-af13-3f87dee56e24	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	94a74c9da1de74fdae59b448c751491cbede8377b950d2b704a65596b4ce9594	2026-02-13 04:07:05.99+00	f	2026-01-13 21:07:05.749739+00
817733ae-4c09-4bf3-9eb4-9f8a4d517b7e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	94a74c9da1de74fdae59b448c751491cbede8377b950d2b704a65596b4ce9594	2026-02-13 04:07:05.992+00	f	2026-01-13 21:07:05.750842+00
79fb438c-d461-43bb-93af-1aedaf94d1f2	637ad6c2-4ebe-4a34-9dee-4069973bf704	285950d987fc7743b370089a1b312c14d6f73872515a1d9bbb4065425110a465	2026-05-29 09:30:14.636+00	f	2026-04-29 09:30:15.342667+00
7c73a3a2-88b1-4845-992b-420f480e4655	637ad6c2-4ebe-4a34-9dee-4069973bf704	9eab62c953d9e12bb10f8ee9e595de7ce3bfc44376f031022d5b4e409d4eda72	2026-05-29 10:24:20.901+00	f	2026-04-29 10:24:21.635123+00
1042a3b3-bd72-4d65-9f02-2b5731b24152	637ad6c2-4ebe-4a34-9dee-4069973bf704	30c72d6044158d77a919bc0dac053bbd3c5f294dc3c89c54bbd326de4a0b3ab7	2026-05-29 10:24:26.74+00	f	2026-04-29 10:24:27.475171+00
00e77ae9-0090-4496-a308-0d6bde9e18eb	637ad6c2-4ebe-4a34-9dee-4069973bf704	6360964f0ad2ce3b3733be146f939b6cd78a79398946b2e9d9d78e3e4b782416	2026-05-29 11:47:23.405+00	f	2026-04-29 11:47:23.808664+00
c8d7ca71-f33d-4e64-a34b-cb8e77e68c35	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	719f5abbe6d67a24b483f4654b69715cabaed095959141ef30417db6f4b7a3e5	2026-02-13 04:20:47.729+00	f	2026-01-13 21:20:47.542172+00
64445832-1ec0-4a5d-bd35-11916dee43d6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	94a74c9da1de74fdae59b448c751491cbede8377b950d2b704a65596b4ce9594	2026-02-13 04:07:05.992+00	t	2026-01-13 21:07:05.750388+00
d4e1f7a3-0634-4810-94dc-b5f60f203381	637ad6c2-4ebe-4a34-9dee-4069973bf704	b15cc14ca7a13d28a95dc266e39126b246f81473aa7e8a271686ebdc05ce224c	2026-05-29 12:58:24.356+00	f	2026-04-29 12:58:24.802992+00
b1a7ff7f-8013-485c-a6c6-b02712bc6ab9	637ad6c2-4ebe-4a34-9dee-4069973bf704	24b6ec83195518b923995465d372c2e0e3623d8eaf674bbbeeb26d1d30dc2cbc	2026-06-03 07:57:34.419+00	t	2026-05-04 07:57:32.979272+00
f79525a7-0523-4874-9ab1-bfc9abe78a78	637ad6c2-4ebe-4a34-9dee-4069973bf704	5f61e5a42316c331d005f7183cffa9c1f3065e25cff51ebd8d0ef5235a97c898	2026-06-03 07:57:34.831+00	f	2026-05-04 07:57:33.391309+00
dabe42db-50f4-43ee-acb5-63a7f911aaf3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	719f5abbe6d67a24b483f4654b69715cabaed095959141ef30417db6f4b7a3e5	2026-02-13 04:20:47.871+00	f	2026-01-13 21:20:47.646439+00
737d1e32-5163-4ab3-9c60-4881bedf69fa	637ad6c2-4ebe-4a34-9dee-4069973bf704	9ce640fb7c740acc8b21a348c65b24c1ba49a4dfb641c47910e81b61316d2701	2026-02-19 13:58:16.831+00	f	2026-01-20 13:58:16.861058+00
d1dc5a2f-f493-478e-a13a-a3f2bc2559db	637ad6c2-4ebe-4a34-9dee-4069973bf704	975dbdfb6eabb1e942ba3dff5540bcc8cfce2ac0c94358b49825ee19ec5ff6a0	2026-03-04 09:47:35.172+00	f	2026-02-02 09:47:35.145408+00
51e40e99-c595-47b0-8b41-c39d90d67578	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5eb7f277076b05c5c8fcf55906a668a00eda5c8a86196860f6a6f7bb147fe45e	2026-05-28 11:13:08.34+00	f	2026-04-28 11:13:08.991689+00
530c3c76-24c0-4c23-850b-a04032ae0614	637ad6c2-4ebe-4a34-9dee-4069973bf704	e0d6a343af019f494d77396f9a6d9cf1912c4c169e631664e42892cbf60f8440	2026-05-29 09:30:59.157+00	f	2026-04-29 09:30:59.858742+00
7d1db2d9-a0e5-4388-bae3-0551f63aeb9f	637ad6c2-4ebe-4a34-9dee-4069973bf704	7367fd8b74d5c7d620a12470c9e4153029c5c0d80e691a77014e7158fe6b2856	2026-05-29 10:25:25.782+00	t	2026-04-29 10:25:26.517475+00
c787c349-b4df-4f63-b0ad-21dfac5f39c8	637ad6c2-4ebe-4a34-9dee-4069973bf704	f9159ca34f3610b57d3865ab437933f6f1ad9c16113285861d6e3c3c592b941a	2026-05-29 10:25:26.447+00	f	2026-04-29 10:25:27.181567+00
7eae36de-f2ab-4901-9bf5-39c74b05b221	637ad6c2-4ebe-4a34-9dee-4069973bf704	6ff69c510ab46a6c90e8472089352329e8b99f1a31e40af5fb18c07da8bed4f2	2026-05-29 11:48:34.806+00	f	2026-04-29 11:48:35.208892+00
e057fdd3-487e-4d94-9c36-5bbedc2ec588	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1a51509d98985ed5295feece7f6fe9d22ce6fb8bfe7d12dcb2bbd612add1041f	2026-05-29 12:59:21.3+00	t	2026-04-29 12:59:21.743019+00
d1f5cf6a-c6e5-4f7d-be92-ee14c492c48e	637ad6c2-4ebe-4a34-9dee-4069973bf704	1239a3339fdf8107adaf270a7a8d446d9464311d50456dcc87c73956c7cc993d	2026-06-03 08:07:57.5+00	f	2026-05-04 08:07:56.065838+00
f37050d4-c9a7-40f2-86bd-2ec660c3fd46	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	719f5abbe6d67a24b483f4654b69715cabaed095959141ef30417db6f4b7a3e5	2026-02-13 04:20:47.865+00	f	2026-01-13 21:20:47.646251+00
4dd96606-4bbe-4418-8447-358e22c0a6d1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	719f5abbe6d67a24b483f4654b69715cabaed095959141ef30417db6f4b7a3e5	2026-02-13 04:20:47.873+00	f	2026-01-13 21:20:47.669382+00
1f7a0a87-c509-4623-972e-0bf3e0ecf2cd	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	25a521dac4216f6583dca1ae8e65d224ee233b7f7e403ee4c44fbce445214b49	2026-02-13 04:26:44.683+00	f	2026-01-13 21:26:44.463173+00
f016a455-84cd-45b5-9b25-335130e0e2d5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	25a521dac4216f6583dca1ae8e65d224ee233b7f7e403ee4c44fbce445214b49	2026-02-13 04:26:44.696+00	f	2026-01-13 21:26:44.488332+00
a7a7d09a-0d9d-4e0d-b0e2-70ab672f342d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	23461e0868037239de212a8820b8d8d2c8cc9cc1cdeca265f661196976ca03d8	2026-02-13 04:53:37.257+00	t	2026-01-13 21:53:37.059438+00
7c580c07-eeaa-41b9-ad72-865c337cecbe	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	86b061381aa26750db19f19891ff125480a9eab167970e1fbc5ce8a8b40dcab6	2026-02-13 04:42:10.505+00	t	2026-01-13 21:42:10.296684+00
877d12f6-5d15-480b-8828-97b137e5d409	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3ab78b09b426b5feeac851c76b317c281a306753021e48b77d61507437c3bc7e	2026-02-13 04:48:31.003+00	f	2026-01-13 21:48:30.818605+00
5d32a003-f1df-49cd-a8b9-9c1f95dc8faf	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	25a521dac4216f6583dca1ae8e65d224ee233b7f7e403ee4c44fbce445214b49	2026-02-13 04:26:44.682+00	t	2026-01-13 21:26:44.460198+00
42688ba2-7a76-49cc-8690-3c5628ff366a	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1ae6adfff210f569731aa148382754bca79cf830c688a0ffb3275146d18302cc	2026-02-13 04:31:58.738+00	f	2026-01-13 21:31:58.52323+00
83fb2611-728f-4e69-b8c3-46d75208c9ad	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1ae6adfff210f569731aa148382754bca79cf830c688a0ffb3275146d18302cc	2026-02-13 04:31:58.739+00	f	2026-01-13 21:31:58.523774+00
f45f5960-af80-45e7-bc7f-2eadd5690aa8	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1ae6adfff210f569731aa148382754bca79cf830c688a0ffb3275146d18302cc	2026-02-13 04:31:58.741+00	f	2026-01-13 21:31:58.524128+00
48699363-8e6d-43e7-a3ca-9191bfb89b29	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1ae6adfff210f569731aa148382754bca79cf830c688a0ffb3275146d18302cc	2026-02-13 04:31:58.74+00	f	2026-01-13 21:31:58.524161+00
9bcd1235-cf52-4e62-a635-fd6bde71547d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1ae6adfff210f569731aa148382754bca79cf830c688a0ffb3275146d18302cc	2026-02-13 04:31:58.742+00	f	2026-01-13 21:31:58.528177+00
519b0af9-44a2-460d-91b4-d711dccbfde4	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3ab78b09b426b5feeac851c76b317c281a306753021e48b77d61507437c3bc7e	2026-02-13 04:48:31.003+00	f	2026-01-13 21:48:30.818855+00
c51bf12a-1939-440c-886d-fe2da6af6c40	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3ab78b09b426b5feeac851c76b317c281a306753021e48b77d61507437c3bc7e	2026-02-13 04:48:31.04+00	f	2026-01-13 21:48:30.839708+00
4dc2245a-c6ed-4aa7-87ae-bd3a23877d06	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c78f6f1f5643e9d1f68b128522d4b862a4e23e34acd456896edc80cea143add2	2026-02-13 04:59:11.799+00	f	2026-01-13 21:59:11.608726+00
7a4237bf-f4a0-48d8-b316-27da6f0f7caa	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	25a521dac4216f6583dca1ae8e65d224ee233b7f7e403ee4c44fbce445214b49	2026-02-13 04:26:44.682+00	t	2026-01-13 21:26:44.462392+00
66acb0c2-933c-41fa-b2ca-91404d4f8a3d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	36873d786d84e22a6377d4ae4440612d0b2b5be0254981ab90f94304fdddf663	2026-02-13 04:31:59.146+00	f	2026-01-13 21:31:58.929175+00
3218f1d8-621f-4bc5-af25-4d3d175bb56a	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	36873d786d84e22a6377d4ae4440612d0b2b5be0254981ab90f94304fdddf663	2026-02-13 04:31:59.146+00	f	2026-01-13 21:31:58.92942+00
ce2be921-35cc-4e11-a623-e65e791b7b60	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	36873d786d84e22a6377d4ae4440612d0b2b5be0254981ab90f94304fdddf663	2026-02-13 04:31:59.146+00	f	2026-01-13 21:31:58.929124+00
b86fb4be-7e8e-413a-85c6-62246f03fd76	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	25a521dac4216f6583dca1ae8e65d224ee233b7f7e403ee4c44fbce445214b49	2026-02-13 04:26:44.683+00	t	2026-01-13 21:26:44.463179+00
c1dbb80a-50b3-432f-b5ec-204180fefd87	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	36873d786d84e22a6377d4ae4440612d0b2b5be0254981ab90f94304fdddf663	2026-02-13 04:31:59.478+00	f	2026-01-13 21:31:59.262543+00
0737fcc7-179a-4649-b447-48d1dd6bfe6c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c78f6f1f5643e9d1f68b128522d4b862a4e23e34acd456896edc80cea143add2	2026-02-13 04:59:11.799+00	f	2026-01-13 21:59:11.61851+00
9290a4fa-8c58-4943-aeee-31a67b5dfd3c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c78f6f1f5643e9d1f68b128522d4b862a4e23e34acd456896edc80cea143add2	2026-02-13 04:59:11.8+00	f	2026-01-13 21:59:11.618565+00
46ac7530-62b9-4bf1-93c4-6f99164da821	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c78f6f1f5643e9d1f68b128522d4b862a4e23e34acd456896edc80cea143add2	2026-02-13 04:59:11.8+00	f	2026-01-13 21:59:11.618834+00
0453af19-4d86-4e50-a8c4-ea31b2d3ffe9	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	36873d786d84e22a6377d4ae4440612d0b2b5be0254981ab90f94304fdddf663	2026-02-13 04:31:59.145+00	t	2026-01-13 21:31:58.927768+00
e43dcc3e-1965-4394-8721-5a981414015b	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8d885290567e2876dc49aaac37e814712e635665e34c54505a215993494837ce	2026-02-13 04:37:00.868+00	f	2026-01-13 21:37:00.765409+00
c747a147-0679-43a5-9685-a6767e2bff80	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8d885290567e2876dc49aaac37e814712e635665e34c54505a215993494837ce	2026-02-13 04:37:00.869+00	f	2026-01-13 21:37:00.766621+00
5a66f647-e91b-45bb-8594-916e21f62602	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8d885290567e2876dc49aaac37e814712e635665e34c54505a215993494837ce	2026-02-13 04:37:00.869+00	f	2026-01-13 21:37:00.766849+00
731f7df8-e664-4222-af4c-e374ac7f737e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8d885290567e2876dc49aaac37e814712e635665e34c54505a215993494837ce	2026-02-13 04:37:00.869+00	f	2026-01-13 21:37:00.766597+00
f14cceb2-45e7-4f57-a6ae-2b9f257355fb	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3ab78b09b426b5feeac851c76b317c281a306753021e48b77d61507437c3bc7e	2026-02-13 04:48:31.017+00	t	2026-01-13 21:48:30.818493+00
4c5c781d-4978-4d20-a95f-a418e920b79a	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	23461e0868037239de212a8820b8d8d2c8cc9cc1cdeca265f661196976ca03d8	2026-02-13 04:53:37.258+00	f	2026-01-13 21:53:37.063425+00
bdfede8c-e52c-4b46-bdcf-fbb5915e2311	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8d885290567e2876dc49aaac37e814712e635665e34c54505a215993494837ce	2026-02-13 04:37:00.868+00	t	2026-01-13 21:37:00.764002+00
c4b3ba92-c17c-486c-8daf-99fb93b812d1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	86b061381aa26750db19f19891ff125480a9eab167970e1fbc5ce8a8b40dcab6	2026-02-13 04:42:10.507+00	f	2026-01-13 21:42:10.303543+00
4d8f4f76-551b-4b4d-8f04-f5fee54d203d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	86b061381aa26750db19f19891ff125480a9eab167970e1fbc5ce8a8b40dcab6	2026-02-13 04:42:10.506+00	f	2026-01-13 21:42:10.303533+00
fe400529-7d7e-4453-bc0b-0c67012c8054	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	86b061381aa26750db19f19891ff125480a9eab167970e1fbc5ce8a8b40dcab6	2026-02-13 04:42:10.509+00	f	2026-01-13 21:42:10.305141+00
eacc4b22-8371-4ad1-8681-4fbcfa367374	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	86b061381aa26750db19f19891ff125480a9eab167970e1fbc5ce8a8b40dcab6	2026-02-13 04:42:10.509+00	f	2026-01-13 21:42:10.305283+00
ee13cad9-7c72-4c87-8fb4-15e01077da82	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	23461e0868037239de212a8820b8d8d2c8cc9cc1cdeca265f661196976ca03d8	2026-02-13 04:53:37.36+00	f	2026-01-13 21:53:37.164244+00
717dab2d-b2e4-4bda-8236-ef24496f6b07	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c78f6f1f5643e9d1f68b128522d4b862a4e23e34acd456896edc80cea143add2	2026-02-13 04:59:11.85+00	f	2026-01-13 21:59:11.664733+00
b6aa16af-4cfc-43c6-81f8-565427fe888d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	23461e0868037239de212a8820b8d8d2c8cc9cc1cdeca265f661196976ca03d8	2026-02-13 04:53:37.259+00	t	2026-01-13 21:53:37.063306+00
c185ced0-9c31-4cc9-ab5d-928f213129e2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8e31418c6b2a743d0ded7e452c7649902d00d5d98477283e9b00d8f9c0109140	2026-02-13 04:48:30.906+00	f	2026-01-13 21:48:30.704905+00
c9b30343-380d-471c-9094-30140b516613	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	83c271a02d65305a16d69934972ab5e057e50ae90f81e23a4e15eb392a9e617a	2026-02-19 13:59:17.935+00	f	2026-01-20 13:59:17.959169+00
78ab684c-ed03-4fc3-916e-aad93454b4b3	637ad6c2-4ebe-4a34-9dee-4069973bf704	0d65d29e57aa181d4abb16948af28c513067d939693d2b4014e46acb5644e67b	2026-03-04 09:54:12.947+00	f	2026-02-02 09:54:12.91139+00
c102f0c4-cb3d-4600-abb6-c4970194d244	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	23461e0868037239de212a8820b8d8d2c8cc9cc1cdeca265f661196976ca03d8	2026-02-13 04:53:37.258+00	t	2026-01-13 21:53:37.061599+00
34736a9b-e793-4e39-9955-d9ec3435e1d5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5df1e9e0bca5264bed02294de3c9e16be5051f8a919210be7df3a6e42a00c4c5	2026-02-13 04:59:12.2+00	f	2026-01-13 21:59:12.015501+00
4ba6c014-e3c3-4ec7-9830-de30432020c3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5df1e9e0bca5264bed02294de3c9e16be5051f8a919210be7df3a6e42a00c4c5	2026-02-13 04:59:12.406+00	f	2026-01-13 21:59:12.219677+00
0c72e8f8-ab7f-4dcb-bd93-fbf3ffe5582a	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5df1e9e0bca5264bed02294de3c9e16be5051f8a919210be7df3a6e42a00c4c5	2026-02-13 04:59:12.408+00	f	2026-01-13 21:59:12.219922+00
21eda96f-8d68-45df-a2ff-f288c94b3c45	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5df1e9e0bca5264bed02294de3c9e16be5051f8a919210be7df3a6e42a00c4c5	2026-02-13 04:59:12.407+00	f	2026-01-13 21:59:12.219677+00
6c11615b-7100-42f4-bf9d-b6466f6c4b81	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5df1e9e0bca5264bed02294de3c9e16be5051f8a919210be7df3a6e42a00c4c5	2026-02-13 04:59:12.911+00	t	2026-01-13 21:59:12.723794+00
47f39c24-6083-4487-a206-854b6f8236ae	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1612adfa16a60805b2e22d38d9fba8115f1fcf39998a25fa94abc67b2896d696	2026-02-13 05:04:56.824+00	f	2026-01-13 22:04:56.644247+00
75a19841-38b3-4938-adc6-42a67b15b6ce	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1612adfa16a60805b2e22d38d9fba8115f1fcf39998a25fa94abc67b2896d696	2026-02-13 05:04:56.827+00	f	2026-01-13 22:04:56.644757+00
056af43a-7571-438b-b8b0-f1d03d50a70e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1612adfa16a60805b2e22d38d9fba8115f1fcf39998a25fa94abc67b2896d696	2026-02-13 05:04:56.825+00	f	2026-01-13 22:04:56.64444+00
cb63d62c-b5d0-4fef-8015-e97c44d7f80c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1612adfa16a60805b2e22d38d9fba8115f1fcf39998a25fa94abc67b2896d696	2026-02-13 05:04:56.828+00	f	2026-01-13 22:04:56.646024+00
d53a87d8-9e6f-4fcb-849c-c5ea00a02613	637ad6c2-4ebe-4a34-9dee-4069973bf704	d2c536b61765b2fedf68c7a2715ad2bc57dcd187f0762432a95f0e9fe63473af	2026-02-19 13:59:32.928+00	f	2026-01-20 13:59:32.952505+00
7d146279-6612-4f90-ac89-9a9cd80fa6e2	637ad6c2-4ebe-4a34-9dee-4069973bf704	42c917cd9461687e851749851dc632f0fdc375fda2352e715c9d100fd0624f26	2026-03-04 10:05:42.075+00	f	2026-02-02 10:05:42.051775+00
3a15692e-5215-47e5-97af-32c54e784e93	637ad6c2-4ebe-4a34-9dee-4069973bf704	14de9f556ab6d5e20f19448fee97d9cb6d3a82b4f742796c84bd15b5ba40114f	2026-05-29 08:38:37.11+00	f	2026-04-29 08:38:37.782493+00
2589c951-fe66-4d54-8c1f-4c51b502695a	637ad6c2-4ebe-4a34-9dee-4069973bf704	f09a1c777b65fac6e3c4f9a1253055505419a92329f9b1227a80df0b65eedb06	2026-05-29 09:31:34.068+00	f	2026-04-29 09:31:34.768935+00
8614f63b-8565-4c3e-93f3-a73179200457	637ad6c2-4ebe-4a34-9dee-4069973bf704	07d6bf5d1960c0be99c6908993f44f87ff23bf155b2818054498da55e4ab049c	2026-05-29 10:25:48.908+00	f	2026-04-29 10:25:49.641697+00
130a492f-6011-47d0-8861-a8141ce43ddc	637ad6c2-4ebe-4a34-9dee-4069973bf704	a288e6e03e58a8d605026db8908c8e47cc30e7e7b1ba561537484df57a5779f8	2026-05-29 11:52:17.288+00	f	2026-04-29 11:52:17.693042+00
21cf4d2c-919a-4349-9942-170088363fc2	637ad6c2-4ebe-4a34-9dee-4069973bf704	04dbf97b65e3483cc987720d160edd66075e30389959c44bfcb5bba7b1575740	2026-05-29 12:59:46.378+00	t	2026-04-29 12:59:46.822266+00
52f24b60-5763-47e8-9f48-b354c21c61be	637ad6c2-4ebe-4a34-9dee-4069973bf704	27bee29d706865302c37bfd1b8afb3d14c51ba73e1f86a38cd1cdcd120d26b16	2026-05-29 12:59:47.004+00	f	2026-04-29 12:59:47.44826+00
9e42d7da-f7e8-447c-8b7b-3eae6c0ffd70	637ad6c2-4ebe-4a34-9dee-4069973bf704	1dc0118ebfe41fe2a87daa603fedcd39982afdafd0d9ae6c450df68c0605297c	2026-06-03 08:24:47.91+00	f	2026-05-04 08:24:46.487257+00
f3374cc2-1094-40b6-be1a-a9c646326e4e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1612adfa16a60805b2e22d38d9fba8115f1fcf39998a25fa94abc67b2896d696	2026-02-13 05:04:56.829+00	f	2026-01-13 22:04:56.647117+00
4d8b0ae3-3538-4de1-9c3d-3a3f8efbc4d5	637ad6c2-4ebe-4a34-9dee-4069973bf704	3fdfc267d1dcf2e3bf49d339c6d100029f0045f6fa0021c67165c2a58494bb6a	2026-02-19 14:01:45.939+00	f	2026-01-20 14:01:45.967707+00
53434a43-e386-47de-a9fc-565b3fd3a550	637ad6c2-4ebe-4a34-9dee-4069973bf704	cc35e43736ac3ad65d011f3d401d219828471a2055878d66847ca85442a6d831	2026-03-04 10:06:22.306+00	f	2026-02-02 10:06:22.289998+00
fa142ed5-e3b3-4930-a59c-8df237b6e188	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3a05fdb199691933176b99193cd7e72e7ea5a6e8819de93fcb9858a85b5da18a	2026-05-29 08:39:59.667+00	t	2026-04-29 08:40:00.339476+00
e4b8d056-a5b5-4f5c-9cac-9d305cf877bd	637ad6c2-4ebe-4a34-9dee-4069973bf704	33868da0904271022e69add6462dc1c8b682f5004882abf5ddf8e7f0fdd025e6	2026-05-29 09:45:55.803+00	f	2026-04-29 09:45:56.512693+00
6904e32d-a53c-4b77-b02d-84ecd89bdf78	637ad6c2-4ebe-4a34-9dee-4069973bf704	b0cef5e38877b81f0b549ec484d904c4201c37fe48c72a935d4e7f17d1927a60	2026-05-29 10:26:15.013+00	f	2026-04-29 10:26:15.74661+00
6d64f655-9eaf-4e0f-92ce-c41971b1db8c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c37f145ce29c164d5537902203cb2f0104b8549a4edfbae94f01883d42af778d	2026-05-29 12:19:33.398+00	t	2026-04-29 12:19:33.819657+00
683bdd37-678d-47ee-add9-52de8070b798	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	af3e776403963c0b31565114eeab3e416a1734d43f31d7b0a0de2a1365d01bb0	2026-02-13 11:43:41.724+00	f	2026-01-14 04:43:40.169557+00
1cb6ae09-6b98-4c43-8da4-9a0d9305afa7	637ad6c2-4ebe-4a34-9dee-4069973bf704	7aacb40803e8bea6e3e449cdd01b62b053154877201cbf5266460dea49ede942	2026-05-29 13:01:34.348+00	f	2026-04-29 13:01:34.796142+00
5c0a095f-3fcd-4511-8e3a-b0e1bb0ff7a7	637ad6c2-4ebe-4a34-9dee-4069973bf704	bf034a893b27a3d8c86544852c49b44d9c11503c7da336fa4c1b06ac69fe10fb	2026-06-03 08:25:05.552+00	f	2026-05-04 08:25:04.127367+00
20cab23a-aeea-4d8c-b736-66fdd5b0d718	daa74fd2-afa3-408a-b50b-f1ffa476d608	9848e67fccf489f1c4ebefc29c5fc81acd9bc12ca874fa2dca996a9f6db22b41	2026-02-13 11:42:45.91+00	t	2026-01-14 04:42:44.353805+00
13ff6c87-a928-4b40-b9e4-71aaf1ed1931	daa74fd2-afa3-408a-b50b-f1ffa476d608	a52344580cbeb1a9fcd0ace7a6fa3dd8dd68ee40632b1e18e1adcb4673cdf3dd	2026-02-13 12:12:49.01+00	t	2026-01-14 05:12:47.469204+00
653bb01f-e9a4-4914-b872-1546d763a4bb	daa74fd2-afa3-408a-b50b-f1ffa476d608	d02121f9a6cf5c7c98ecdf05258460d82abdf5384d927143dc777a836a638da0	2026-02-13 12:19:44.729+00	t	2026-01-14 05:19:43.191596+00
4d814656-ebd8-4355-b902-01a761bdd3b2	daa74fd2-afa3-408a-b50b-f1ffa476d608	1170e6007b708bc7df7ba99330223d40d0c6acb0d7bffad5f223a77bef22dc01	2026-02-13 16:31:14.709+00	t	2026-01-14 09:31:13.94495+00
c2f01023-52eb-408d-8146-6f421d2ce9ab	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	202b7b6e70ce1d4d3072390ed68e2100c4d7d21d2c61961788c4631772b58da2	2026-02-13 11:45:53.74+00	t	2026-01-14 04:45:52.176764+00
bbcc7801-cd9c-4d60-92f2-8b65da1ff553	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	01da024f1ce8f7b01a5d249121d42cf8877f9b6beda06d3bac9926951f82ae31	2026-02-13 12:26:50.485+00	f	2026-01-14 05:26:48.952857+00
b3e91965-1c5b-4765-bdc7-0f8028975d03	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	01da024f1ce8f7b01a5d249121d42cf8877f9b6beda06d3bac9926951f82ae31	2026-02-13 12:26:50.501+00	f	2026-01-14 05:26:48.972461+00
c5908d4e-4096-405f-85ad-34d56ad771f9	daa74fd2-afa3-408a-b50b-f1ffa476d608	22ffefe6be735da01812b3565b816c95c113da722f958fc25fe9a8c7ec02bd4b	2026-02-13 12:24:50.972+00	t	2026-01-14 05:24:49.438663+00
6d551687-5015-4159-b812-7c7e88836877	daa74fd2-afa3-408a-b50b-f1ffa476d608	aac8e52349645c83371ca1a7fb49d82e1f483dc2d6ef84d40a30c3f7bb92a3a9	2026-02-13 12:30:22.156+00	t	2026-01-14 05:30:20.627471+00
1fc9015f-41a4-4eee-9fb1-128b7bcaed00	daa74fd2-afa3-408a-b50b-f1ffa476d608	291999c141860a304f245b54d62428aefb16eff0e275aae8275507d4e0947b6f	2026-02-13 12:36:10.795+00	t	2026-01-14 05:36:09.270352+00
c3482ca1-2679-4a90-afa5-c51c5fe0c8bd	daa74fd2-afa3-408a-b50b-f1ffa476d608	4fb624de6727152180ee893c3e5a71e51c117b7120df5f723d5f4770c8375e71	2026-02-13 13:06:27.814+00	f	2026-01-14 06:06:26.305627+00
887c6ec4-35fb-47b3-8baa-7f18bbc9b4d1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b59d90083526942f0123e005b33a50dc4d374b7d12073a10a04d34610225877b	2026-02-13 12:27:05.475+00	t	2026-01-14 05:27:03.942701+00
c3d4fb41-15ab-43f4-81be-14815716a699	daa74fd2-afa3-408a-b50b-f1ffa476d608	47695b8a636f2d4942abe5d3af8fba6b59a51a49ec581c78ec87b02c7fb3d4a6	2026-02-13 13:07:37.565+00	t	2026-01-14 06:07:36.06958+00
68fa6230-d386-4890-b7f0-2b112a92936c	daa74fd2-afa3-408a-b50b-f1ffa476d608	16e42b386549eb0ddd02c9f1c718c54d3e63988a8c9cb033e1124c0670da8941	2026-02-13 13:51:01.026+00	f	2026-01-14 06:50:59.546758+00
dc672772-8b4b-481b-b52c-eee7bbaef79e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8917c5ad68194e46702a6b074c19c3f4ac52e58fe5fb2e2563547cd6a0f5b0f3	2026-02-13 15:01:28.714+00	t	2026-01-14 08:01:28.462826+00
bbe6a0ae-f18c-4532-baae-e4a2c574a7df	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e81364e0d7fe1dcd188cd143f244824cf3805d3b7fa7c83e99a713b1bdfa1b34	2026-02-13 15:39:28.805+00	f	2026-01-14 08:39:28.58721+00
50ac668b-3a6b-46fa-aa52-937b7c89575d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3a9051810193e0ab8e2668b45d39c9876cfc7994cca853a36491cf83eed96f17	2026-02-13 13:06:35.799+00	t	2026-01-14 06:06:34.292092+00
1083ea0a-92dc-40f6-83d9-4ba1774aa3f3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a3fcdf526b510975a57ab2af65310e9628f0f6f7c197b8f0b8f0b1ccc7a53953	2026-02-13 15:39:46.007+00	t	2026-01-14 08:39:45.792188+00
d507e4ec-8109-4c63-ad52-79ac5fdb41e4	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	bfe3d994289b059f6887e181cb57c2b56eff49ed81c6319cedfc4d79336e7cd3	2026-02-13 16:10:24.125+00	f	2026-01-14 09:10:23.938567+00
a78608b8-402b-4904-880b-10390ad75739	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	bfe3d994289b059f6887e181cb57c2b56eff49ed81c6319cedfc4d79336e7cd3	2026-02-13 16:10:24.124+00	t	2026-01-14 09:10:23.937341+00
34a22fb8-141c-4860-86fc-365703502385	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	884e078df25b3d3f41f9ff2d7107d8d5a998414cdb949865afce7d99a12591e2	2026-02-13 16:20:24.268+00	f	2026-01-14 09:20:24.096309+00
46aa7cc4-2405-4814-a8ce-a674735d1078	daa74fd2-afa3-408a-b50b-f1ffa476d608	1a8e33de2f41e719c89b4e167d1718b1e6e3da24ecf47c279e233e59ce70b385	2026-02-13 15:58:48.958+00	t	2026-01-14 08:58:48.171351+00
3fea78d5-6be2-460c-9822-28314fb5928b	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	884e078df25b3d3f41f9ff2d7107d8d5a998414cdb949865afce7d99a12591e2	2026-02-13 16:20:24.269+00	t	2026-01-14 09:20:24.09468+00
3983413b-d826-41f6-8314-ef2b739b597d	daa74fd2-afa3-408a-b50b-f1ffa476d608	341cae7691312d25ed1e75a9ea689add807fcfa874be03bef88f181c89a4a5e4	2026-02-13 16:36:49.386+00	t	2026-01-14 09:36:48.626682+00
ec183095-9a6c-4f26-a52f-a91664f85754	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	41bc1668111e5694707b085ff6cd708d4ee5c5029b029882e9b94acd29249785	2026-02-13 16:33:31.095+00	t	2026-01-14 09:33:30.938109+00
22292fba-99b1-4c0f-97f7-5844bae33543	daa74fd2-afa3-408a-b50b-f1ffa476d608	e670034cd315e0542b14b86e60c61c9f8b2eae5eace970bb9f1417762f534867	2026-02-13 16:45:10.246+00	t	2026-01-14 09:45:09.489279+00
a0385f71-dbdc-4b5c-9168-39e789d0502b	daa74fd2-afa3-408a-b50b-f1ffa476d608	b9e1ce5db11180cd90b0da142cf7c30ac918a8d3f0cfb260fe4263d6ee99b335	2026-02-13 16:54:57.906+00	t	2026-01-14 09:54:57.156837+00
1cf8bd1e-27bf-4ea2-8df7-d8ea69b7026e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	f67cb6510f512e92d7ecdd1ccca302a8479b3ea53a82e88e077f08e0fa733a58	2026-02-13 15:58:42.456+00	t	2026-01-14 08:58:41.664062+00
dedffdf6-5492-4010-be27-94734c6665cb	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	30f080a06e115cec287d187ec0e4bc11c5918a8a6b8439b5a8f98d092d1f1781	2026-02-13 16:46:13.198+00	t	2026-01-14 09:46:13.051056+00
17dd68be-aebb-4ea1-84c6-0a8278cf3dbe	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1c8a809c9fa8567529f7fb95f6cd5797e3b2aa20b0621a873aa3af0daf627a99	2026-02-13 17:06:17.995+00	f	2026-01-14 10:06:17.859841+00
73ea842c-dc6f-4281-8ced-80fe13931d48	637ad6c2-4ebe-4a34-9dee-4069973bf704	9d7d9ba33cdbb8587e9069d9d60285b531979fc3547b0991ed1fb01326a398b5	2026-02-13 16:02:51.667+00	t	2026-01-14 09:02:50.882768+00
f3d55623-e7b9-46d5-87fa-7d890e42c04e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1c8a809c9fa8567529f7fb95f6cd5797e3b2aa20b0621a873aa3af0daf627a99	2026-02-13 17:06:17.999+00	f	2026-01-14 10:06:17.864772+00
627a13aa-f017-4ed3-a635-52c8bc817f0c	19fb8f43-fa15-4f8b-ba45-1fb54e8ca426	56dc64d3263fcf735349938ecc55491a03a6fd95273bd8e96c9857e9459e2c59	2026-02-19 14:18:33.634+00	f	2026-01-20 14:18:33.659881+00
2563b679-5340-45c1-bd15-03c9f0753189	637ad6c2-4ebe-4a34-9dee-4069973bf704	4da85f83c00cd49cc06898621386e01aa53f2f7787513c2f5c9c0abee7f0ff14	2026-03-04 10:10:18.913+00	f	2026-02-02 10:10:18.893671+00
e6ad7bbd-624d-44d6-85c0-115c788f2a3e	637ad6c2-4ebe-4a34-9dee-4069973bf704	74b24bb7790435277f34384bf41467f95c67200ef21e092d6ea9c30994fbcd93	2026-05-29 08:40:25.222+00	f	2026-04-29 08:40:25.89402+00
79a58440-048b-4ca0-9483-0418a23872a3	637ad6c2-4ebe-4a34-9dee-4069973bf704	25c4cf0a4a387cf7be91d21a7a3087152338c1a700860838c1c57a16c31045d6	2026-05-29 10:27:36.087+00	f	2026-04-29 10:27:36.823198+00
066728de-c7dc-46d5-86f9-4dd32768d1e7	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	bc06d7a553d55d30380c9e62de27fcfb1093c3b3c9ab9ee79d24dc1cdffb83bd	2026-05-29 10:01:07.79+00	t	2026-04-29 10:01:08.514982+00
740c17b4-d3f8-4edf-96ec-c459ea9d1f7f	637ad6c2-4ebe-4a34-9dee-4069973bf704	b3e9fb363dd573ecb8a7cffc177cf8d32558e5a39d1a01e9e11ab1760180f160	2026-05-29 12:27:59.864+00	f	2026-04-29 12:28:00.287232+00
80f71b6b-b432-4165-94ec-fdcfedcf79dd	637ad6c2-4ebe-4a34-9dee-4069973bf704	e5eb394e7d18e304ca70621744afca8b3fd60983702d30f1024b2142f29af543	2026-05-29 13:02:14.947+00	f	2026-04-29 13:02:15.393999+00
c2efacb8-31b7-4c1b-901c-be5be91ddd68	637ad6c2-4ebe-4a34-9dee-4069973bf704	f77f3a29319f3b24bb599a1c73ea4d63debe0769c6b7b49ad7d1c26d428e400a	2026-06-03 08:31:40.583+00	t	2026-05-04 08:31:39.165732+00
300eb13c-58a9-4c4f-8f65-f2664176066e	637ad6c2-4ebe-4a34-9dee-4069973bf704	16f5fa0b4170ab0288f48cf90ff08fba41d5698fd3d6ee564b3f043529891cb3	2026-06-03 08:31:41.058+00	f	2026-05-04 08:31:39.640772+00
017719ec-049a-492f-ad8d-07f3cabf1558	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1c8a809c9fa8567529f7fb95f6cd5797e3b2aa20b0621a873aa3af0daf627a99	2026-02-13 17:06:17.999+00	f	2026-01-14 10:06:17.86378+00
8f0ef13f-6b9d-4b6e-9645-4d6bcc837893	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5fe8a3fe9d9adaf3d7f759399e80137f6ea6fde0d4836e88ce59a0b8eac19708	2026-02-13 17:16:59.266+00	t	2026-01-14 10:16:59.151844+00
fe29039f-8db4-43ee-91b4-f9405780bf0f	daa74fd2-afa3-408a-b50b-f1ffa476d608	cee4f7ddf03584dff7903c8c414d4c0951e6cd642bc5a9b474dce54f0d638fee	2026-02-13 18:59:09.497+00	t	2026-01-14 11:59:09.852581+00
abcc2357-1b90-45ff-95c0-8f3e51a80697	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	97e1da6a32695fdd287e540d977c457ac6199d8c2ded5af4d8c863d016b723b2	2026-02-13 18:40:08.342+00	t	2026-01-14 11:40:08.294351+00
6cd8bace-9212-495d-a15c-3caa96ad0810	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ab1fdc71eecf7ad13f697400b3ddab35b6dd7ce56e26586f05e1ae9f8b671069	2026-02-13 18:21:41.891+00	f	2026-01-14 11:21:41.824924+00
6c581316-a287-492f-b33c-a5cdc90f6bbe	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e418522d986cb0cdc60d219ed09f0686ecbe119560e09886952ebf266e1f847d	2026-02-13 17:52:01.504+00	f	2026-01-14 10:52:01.406676+00
ad5b38ef-e409-49a5-b07d-0d77bae58fa5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c0208efb0f68a6a6e94753198446586ca6a1c187c865dcd1d03bbabf8195eaba	2026-02-13 18:47:11.169+00	f	2026-01-14 11:47:11.123184+00
8dd85be5-f329-45ed-b3d4-9208429706f9	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	bdc75fc106aa8cac9887f0f784eb0792268c3e020d079cc71eb102f3878e0899	2026-02-13 17:47:00.43+00	t	2026-01-14 10:47:00.324671+00
670b83c6-5be1-4164-8cbe-847183e5837f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e418522d986cb0cdc60d219ed09f0686ecbe119560e09886952ebf266e1f847d	2026-02-13 17:52:01.631+00	f	2026-01-14 10:52:01.548917+00
3c65052e-0709-4510-ac8d-64a27fea6e31	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e418522d986cb0cdc60d219ed09f0686ecbe119560e09886952ebf266e1f847d	2026-02-13 17:52:01.642+00	f	2026-01-14 10:52:01.561529+00
4d33c6e2-ea86-44d7-9a38-72a536ad748d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ab1fdc71eecf7ad13f697400b3ddab35b6dd7ce56e26586f05e1ae9f8b671069	2026-02-13 18:21:41.975+00	f	2026-01-14 11:21:41.911231+00
a65184ec-a87f-4a56-86b5-a18a57224cdf	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c0208efb0f68a6a6e94753198446586ca6a1c187c865dcd1d03bbabf8195eaba	2026-02-13 18:47:11.177+00	f	2026-01-14 11:47:11.131032+00
ce5d2e04-0f13-4063-aebd-69da1d81feb4	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	cf67ea7c3dbd61a8339f08318158e4fb3ea6b9ac066a3518354b90f791c3d91b	2026-02-13 18:14:26.721+00	t	2026-01-14 11:14:26.662868+00
18cccc3c-319e-49fd-9855-8bb718452278	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	646e206668d049cf69d8ab9cb44f6c2f9b7194a21b473b8de3a8ba414c521c71	2026-02-13 17:58:24.438+00	f	2026-01-14 10:58:24.344591+00
5c4b3c57-97a2-4845-ae85-e164994c0577	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	646e206668d049cf69d8ab9cb44f6c2f9b7194a21b473b8de3a8ba414c521c71	2026-02-13 17:58:24.462+00	f	2026-01-14 10:58:24.369236+00
12431e8b-db55-437e-bb26-82794a09fe4f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	646e206668d049cf69d8ab9cb44f6c2f9b7194a21b473b8de3a8ba414c521c71	2026-02-13 17:58:24.487+00	f	2026-01-14 10:58:24.407729+00
b8f1a8eb-811b-4c77-bd6c-d9327c1f981f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	646e206668d049cf69d8ab9cb44f6c2f9b7194a21b473b8de3a8ba414c521c71	2026-02-13 17:58:24.489+00	f	2026-01-14 10:58:24.408632+00
d1f1b18b-8682-40c9-a111-62ddcba32a7f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e418522d986cb0cdc60d219ed09f0686ecbe119560e09886952ebf266e1f847d	2026-02-13 17:52:01.424+00	t	2026-01-14 10:52:01.323847+00
fbd06235-7ed5-4916-8f59-6575863d57e1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	646e206668d049cf69d8ab9cb44f6c2f9b7194a21b473b8de3a8ba414c521c71	2026-02-13 17:58:24.678+00	f	2026-01-14 10:58:24.6111+00
f82a6660-f407-4c82-866f-ebe457dfed3e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e418522d986cb0cdc60d219ed09f0686ecbe119560e09886952ebf266e1f847d	2026-02-13 17:52:01.479+00	t	2026-01-14 10:52:01.382189+00
57f4422d-fcc2-4fc4-9a03-8abdf85e8797	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	89108b1e0c8262cefc4efc898776b74e95202d1f715b04a932fe7a8898364e59	2026-02-13 18:21:42.091+00	f	2026-01-14 11:21:42.040618+00
0b2cec0c-3829-41f2-bca2-4d2093646a76	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	89108b1e0c8262cefc4efc898776b74e95202d1f715b04a932fe7a8898364e59	2026-02-13 18:21:42.094+00	f	2026-01-14 11:21:42.043878+00
2a7013b5-b40d-41de-ae6d-a29a22068a84	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	89108b1e0c8262cefc4efc898776b74e95202d1f715b04a932fe7a8898364e59	2026-02-13 18:21:42.08+00	t	2026-01-14 11:21:42.029114+00
bf4cb877-5050-4897-8663-9ab360030af3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8ef150e47101060836cb340c8db8a216fb74337ba64c8740bcfe3564d5ba09f2	2026-02-13 18:04:03.532+00	f	2026-01-14 11:04:03.442873+00
d6a7c434-50f1-4cc8-a381-a3e9f9f0cfd5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b9850e0f8924759058317bb25e39e486f7b5e34a94c5b775d758962d2fafa747	2026-02-13 17:58:25.488+00	t	2026-01-14 10:58:25.413279+00
adbb8ec7-20c3-497d-a71a-5118e8c00b5f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8ef150e47101060836cb340c8db8a216fb74337ba64c8740bcfe3564d5ba09f2	2026-02-13 18:04:03.64+00	f	2026-01-14 11:04:03.568247+00
ba9f2c3e-e333-48cc-bb3a-25abd4978fb6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8ef150e47101060836cb340c8db8a216fb74337ba64c8740bcfe3564d5ba09f2	2026-02-13 18:04:03.4+00	t	2026-01-14 11:04:03.312118+00
96fc8273-92ee-4f80-b59a-9db853eca5ec	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ed634bafbc7a645bddba0cda3624946f044cd4d6e387b2b5dbb16bef12c039d4	2026-02-13 18:14:25.947+00	f	2026-01-14 11:14:25.872425+00
30274b35-4f39-4903-90b6-c89ecbc049ba	daa74fd2-afa3-408a-b50b-f1ffa476d608	ee476a4c39ab3b8442f109d5b72ad39a9a44c71bf7328168deb7497643b078db	2026-02-13 18:18:53.255+00	t	2026-01-14 11:18:53.600298+00
0e1ff4ab-de2b-48ed-9201-9fa0e501c5c2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8ef150e47101060836cb340c8db8a216fb74337ba64c8740bcfe3564d5ba09f2	2026-02-13 18:04:03.487+00	t	2026-01-14 11:04:03.399545+00
814d9a1a-7e4c-4831-8c2a-a30051d6b5e1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	cf67ea7c3dbd61a8339f08318158e4fb3ea6b9ac066a3518354b90f791c3d91b	2026-02-13 18:14:26.837+00	f	2026-01-14 11:14:26.780441+00
8ada5e90-6f12-41f2-bd87-d5b0959bafa5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	cf67ea7c3dbd61a8339f08318158e4fb3ea6b9ac066a3518354b90f791c3d91b	2026-02-13 18:14:26.917+00	f	2026-01-14 11:14:26.860678+00
2486f2c8-6cc5-4477-8373-f8411369b92f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	cf67ea7c3dbd61a8339f08318158e4fb3ea6b9ac066a3518354b90f791c3d91b	2026-02-13 18:14:26.915+00	f	2026-01-14 11:14:26.861946+00
ae87afb2-c502-4cf0-bf5e-e384228e067d	daa74fd2-afa3-408a-b50b-f1ffa476d608	0d32922f557397f37bb97514d1ebfcb48152e4ecae0f5e352df79c012ab785ea	2026-02-13 18:13:35.3+00	t	2026-01-14 11:13:35.641661+00
adf738db-6890-4872-9c15-9ce45944091b	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	af23d7b9821e078f5bacff6e513c2dc36e64e3b3f2e2a059bf68f90a9cc7bcde	2026-02-13 18:28:33.624+00	t	2026-01-14 11:28:33.566172+00
2133ea95-32a7-438c-9e2b-d6096d4ac9cc	daa74fd2-afa3-408a-b50b-f1ffa476d608	13e668b27d154030f927104b3599c0c09024efe6e47be707d90a09b9f422a4cb	2026-02-13 18:30:43.208+00	t	2026-01-14 11:30:43.558+00
0f317456-3b93-404f-8e20-7d79683909a6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b3ff35296d3e4ed322e1cbb0cc0462600ce5b2805d576809f35258aee38fa9f8	2026-02-13 18:33:38.046+00	t	2026-01-14 11:33:37.992834+00
8904a16e-936b-452e-be1b-a78d67de8ffd	daa74fd2-afa3-408a-b50b-f1ffa476d608	bef69943b983790df77bfa89be8dba322ed12378ba678d1e0c6547da868c1294	2026-02-13 18:37:18.669+00	t	2026-01-14 11:37:19.025068+00
3a71c771-861f-422e-aa2a-de3b15802ebe	daa74fd2-afa3-408a-b50b-f1ffa476d608	2ea6ee276094e34d5af2fcccbe8634747e421a00d58eb9323824887c900b6cb7	2026-02-13 18:42:33.921+00	t	2026-01-14 11:42:34.272132+00
c49b2539-62f4-4827-883b-3260699349d9	daa74fd2-afa3-408a-b50b-f1ffa476d608	982006ffd62d9486e61f558a203d29fc13227627514fa9c75463282e439d694a	2026-02-13 18:47:58.496+00	t	2026-01-14 11:47:58.847495+00
1a037e0b-929a-49d6-9b9d-78a6b8eeb70b	daa74fd2-afa3-408a-b50b-f1ffa476d608	d8b33e882e76d5adc475e10569d2672eba6ddd5e29f4f42d6f8dddf41627f953	2026-02-13 18:53:11.641+00	t	2026-01-14 11:53:11.998784+00
898ce61f-eaac-4a3a-b99a-e80e2a0327d0	daa74fd2-afa3-408a-b50b-f1ffa476d608	766fe1574d4bb8d50644bf2024582016981e64bae302eeeb832afb337008dcf7	2026-02-13 19:04:09.646+00	t	2026-01-14 12:04:10.008833+00
a3d147e2-8639-4f13-a8f3-655f9bf6fde8	daa74fd2-afa3-408a-b50b-f1ffa476d608	f818b51f82abff695cc318fae1273b0445b131e8011773e12e6d690986c12468	2026-02-13 20:48:31.656+00	t	2026-01-14 13:48:31.643474+00
6bc064bc-1abb-4d7d-a1f9-62e0eb5f50bc	daa74fd2-afa3-408a-b50b-f1ffa476d608	47b1e66d218806ee98852c799fa8a21d918ce9559c91a4f6b2c47aeb57ee5b62	2026-02-13 21:02:16.578+00	t	2026-01-14 14:02:16.662381+00
0914341c-4211-4567-96c0-784b4259ce8d	daa74fd2-afa3-408a-b50b-f1ffa476d608	800d0aba581e9ae891458b1123b20975398cd141446f45bb366e0e7b45d9e8b3	2026-02-13 21:08:01.697+00	t	2026-01-14 14:08:01.701928+00
57c786d4-f8f0-45d8-9ada-d11f8c71b346	daa74fd2-afa3-408a-b50b-f1ffa476d608	44fa623a296250a23ce8ce900e23bdcf9518af143f6b3329c48a7ba855706081	2026-02-13 21:13:02.92+00	t	2026-01-14 14:13:02.922719+00
b6937891-f972-4637-b84b-dd7ca6bc0ffa	daa74fd2-afa3-408a-b50b-f1ffa476d608	49fa9cf4540de267288869df01a2f55011bf76c5ff7c8bcb03caa9ef20c5ae69	2026-02-13 21:28:09.715+00	t	2026-01-14 14:28:09.720187+00
97c95f9c-c777-497c-a363-7d235a0532ab	daa74fd2-afa3-408a-b50b-f1ffa476d608	c70326f9ed03632ffaed371d8e995dd973b84a9a84ab3f2e0efaec517e26ceca	2026-02-13 21:34:33.522+00	t	2026-01-14 14:34:33.528498+00
1eddf4b0-1da7-4c57-aedb-0cb611d6478b	daa74fd2-afa3-408a-b50b-f1ffa476d608	1ae41cc0602a34ad06337765fcf4c27f9c5c3794b51011dffee20833c7f8ac8e	2026-02-13 21:43:32.912+00	t	2026-01-14 14:43:32.926196+00
490f912b-6fa6-4b66-96ca-d61c63dfb23d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a6dff1f853ee30b006b87efc2a7662dd778851efe78a93ff341e6fab0ddae038	2026-02-13 18:17:56.718+00	t	2026-01-14 11:17:57.060812+00
6ceaade8-6664-458f-909b-030a0a802a6e	637ad6c2-4ebe-4a34-9dee-4069973bf704	53d8df4dd53fdb68f3a92e7414c183c3c56bfd1b33d94186e9c2e7c6a7ea0c94	2026-02-19 16:22:18.223+00	f	2026-01-20 16:22:18.259873+00
3330b6ec-b448-4ff5-a341-8e563dea22b9	daa74fd2-afa3-408a-b50b-f1ffa476d608	8e2a314acc5545db5723c6f801dbcaf3f28cfafb20b73912d490ad864b05fe5c	2026-02-13 21:51:36.673+00	t	2026-01-14 14:51:36.69784+00
c6e94af6-6df3-4efd-8089-35123a9f70da	daa74fd2-afa3-408a-b50b-f1ffa476d608	607c2c637cd2f8d5eba9ee1d87bc567ef3b6c36a8af162c7891db557f4f20ca9	2026-02-13 22:46:32.425+00	t	2026-01-14 15:46:32.805584+00
5fd8497e-2c21-4049-b398-561d6c9d6b7a	daa74fd2-afa3-408a-b50b-f1ffa476d608	b5776742bf8b3bfbce3dd03a38825330a4b29b8202ecb98391137ea4955e8e84	2026-02-13 23:21:59.954+00	t	2026-01-14 16:22:00.358168+00
82820d3d-029e-4ad4-9985-70b1088d50ef	daa74fd2-afa3-408a-b50b-f1ffa476d608	fb656f7f1d0eefb7fab76fc709d4299b35ef30dbaf12fea58c9c4052acf95e48	2026-02-13 23:27:29.529+00	t	2026-01-14 16:27:29.936281+00
83628770-2e9f-4230-b7e9-bd164d9b1d9c	daa74fd2-afa3-408a-b50b-f1ffa476d608	1838568ea349279c19b7de3aae452caeee7e94cd7bc7a205855db5e797c84a37	2026-02-13 23:39:35.756+00	t	2026-01-14 16:39:36.170846+00
dfcbabab-1c94-4a12-be89-9ee5e563e43a	daa74fd2-afa3-408a-b50b-f1ffa476d608	76616a7df75195ff36f84df9e735dc6fed747af9ee0525be09e22d5f0d18d443	2026-02-13 23:46:51.548+00	t	2026-01-14 16:46:51.971058+00
8fb16a42-6ea6-4026-99f1-943993b67800	daa74fd2-afa3-408a-b50b-f1ffa476d608	45b136a21efd2642197822b37eb7ee61304e1cfd6e889b3c36273143bafc1ee3	2026-02-13 23:51:57.211+00	t	2026-01-14 16:51:57.624894+00
ef5fbbc7-5d7b-49ca-b34a-c900979ec156	daa74fd2-afa3-408a-b50b-f1ffa476d608	1e7e19f7a311c23d7fd78edeed0c261560a79b609c1d288633764f8803dc876e	2026-02-13 23:58:31.583+00	t	2026-01-14 16:58:31.998927+00
01efd45d-2edd-4eb5-939c-21c827462918	daa74fd2-afa3-408a-b50b-f1ffa476d608	66ebd2d228730d5b48755778880003c54760b20c6f296743cf0eabb36f9e380b	2026-02-14 00:11:16.995+00	t	2026-01-14 17:11:17.422611+00
eb9d0f6a-f6c9-46a7-93b2-ffb434639bfc	daa74fd2-afa3-408a-b50b-f1ffa476d608	f7f7e10fd44fdef5b88bb60126c98586c1db4cd780130e8294e22800f8e01062	2026-02-14 00:30:30.66+00	t	2026-01-14 17:30:31.100962+00
6aa63aba-024b-4f53-8c15-ed465eec29e4	daa74fd2-afa3-408a-b50b-f1ffa476d608	28432a7b94d84a0a7e411214cc42ffd9e683043bce1315b40565a76369975436	2026-02-14 00:39:19.451+00	f	2026-01-14 17:39:19.898452+00
fc8f242a-a5d5-4b0c-9fe1-9debc2bf298c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	48d61014e5da2621fd7aae5187ef47fa761d53fca1d861b08d5f3e1fafee15ef	2026-02-14 00:41:40.458+00	f	2026-01-14 17:41:40.907919+00
ed0ef13e-2a65-46e0-97cc-8f9c8aba11f6	637ad6c2-4ebe-4a34-9dee-4069973bf704	ae408b4e448ec5330fda848c5c50f4bdab0b045fb18d444365f0eb2a59b9540a	2026-02-14 00:54:55.815+00	t	2026-01-14 17:54:56.269847+00
7de31cef-4810-4e3c-9b48-c0acfc3d4400	637ad6c2-4ebe-4a34-9dee-4069973bf704	5748968597ba10642905fda78278066f614291147fd60e64368b27b1f750d1a6	2026-02-14 01:01:17.991+00	t	2026-01-14 18:01:18.446642+00
39cd3c1b-d447-4149-9541-d4d74a177d1f	637ad6c2-4ebe-4a34-9dee-4069973bf704	0ae7bcfdcedfc7d3bd1dbcb410e8abda91747f6f0dbaeaf5e96a63a9c2a82aca	2026-02-14 01:13:27.999+00	t	2026-01-14 18:13:28.463118+00
55c34452-f44b-4c2d-a9a0-c159f1bccb51	637ad6c2-4ebe-4a34-9dee-4069973bf704	4ec3a4b6ae3da393a231483c01848aa8ecac129b0bdbda839f4da5cb4c9a808d	2026-02-14 01:23:42.835+00	t	2026-01-14 18:23:43.304421+00
422753e7-26c9-4eec-995d-289b8c6e7d39	637ad6c2-4ebe-4a34-9dee-4069973bf704	42c276c5deef8da5adccde483e364966ab23b91965924509fec8d85038adcf27	2026-02-14 01:28:46.6+00	f	2026-01-14 18:28:47.06999+00
dab0e4f1-59d6-4b89-99f0-690e52603341	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1fdd12d89d6b7360d03e3a9d784352681403845bfa1ff34a00f003ac8e68d4db	2026-02-14 00:58:46.884+00	t	2026-01-14 17:58:46.929449+00
5d1ba883-b33a-47b9-8cdc-bc1c8a750e2f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	92b8a54dcc5b0cfcbd44e506bf84b973b117d30672489d0424f70508dc759900	2026-02-14 01:31:07.333+00	f	2026-01-14 18:31:07.410725+00
1034e3c0-60e9-4491-9e31-81c35ad7a35e	637ad6c2-4ebe-4a34-9dee-4069973bf704	1610ea8bd9544ae844e976e67d0ceedbc515a0aefcedce09c72b7baf1c17576d	2026-02-14 01:32:02.024+00	f	2026-01-14 18:32:02.4952+00
ff48d016-a4d7-4bc0-80f1-ff6dddea4786	690537e3-a003-42c1-8c89-056489c47563	4ba887acce2d2e8044ac16f70f2e8080799246b4f0ddc3ae87882038c26701ae	2026-02-19 16:24:28.095+00	f	2026-01-20 16:24:28.131496+00
1c0948f6-ce06-47bd-8f6b-403d3fd68236	637ad6c2-4ebe-4a34-9dee-4069973bf704	18f6aff17eec3478224ae267ad1a53904f4880311e1355a0e4b9966bb096338a	2026-03-04 10:15:58.859+00	f	2026-02-02 10:15:58.846282+00
1de30959-1003-4fc4-9c97-0fd56e5bee64	637ad6c2-4ebe-4a34-9dee-4069973bf704	14351135a7b36b8496208ce426133e8436eb9772c4f7c62e279bdee63b3e5736	2026-05-29 08:42:54.898+00	f	2026-04-29 08:42:55.572706+00
ded9be81-0177-4036-a158-b029ade99e6e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fe94b6366bd53be447847551ca1406db4d24446034a914210a34a1816fbcb2fc	2026-02-14 01:44:04.39+00	t	2026-01-14 18:44:04.480795+00
3752193c-b209-440f-979d-0ec4f983b2e5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e9218ce3f79bff06df5efa92323ad877f34d14d6107882576636b8d5e2bd909d	2026-02-14 01:44:33.869+00	f	2026-01-14 18:44:33.965425+00
3e830052-9ce7-4bc8-8ba7-efb14eb6d520	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3b6bed64e9ef7a5aff2115f4855e1a6f21a905792d2d58b342d4b6d3ebd934b0	2026-02-14 01:45:55.398+00	f	2026-01-14 18:45:55.489974+00
1e4c78b0-1c10-4099-8261-3f6880a73c0d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	13e37ea3b1b2c9e597c5dd0c36a1fc75d8f54c057a2975b4dd3a684f38ad83bf	2026-02-14 00:42:00.61+00	t	2026-01-14 17:42:01.057439+00
f6aaa3f1-b987-4bf5-ba70-a396fb2b81d0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5cefede9d0c63802dd4a2f0a283ab8250abd85143f7853759d9b5d203df6cf2a	2026-02-14 02:03:06.509+00	f	2026-01-14 19:03:06.814676+00
7046e82d-c3d1-462f-af80-6588f4334592	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	bd067d68946f6dc7a78cc29abda5a10c9efd3d3037d43cf81491c12db1fa216a	2026-02-14 01:46:45.772+00	t	2026-01-14 18:46:45.866075+00
82b9a147-4e8b-4f8a-a1cc-75126ecc36c4	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	56931d77916647a47a4de182cd7b54b2cbc07c430b8e11a2811a0b1ab3cbc71a	2026-02-14 02:19:58.95+00	f	2026-01-14 19:19:59.106617+00
9cae7596-9001-4ae5-86f9-0dcdaef68104	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2d147874e1e7ccb5e714cb9adb0db1f5b1b1ecf063f6796e9e424c900d525a3f	2026-02-14 02:20:09.328+00	f	2026-01-14 19:20:09.460683+00
ed9d86c6-4224-435d-b71e-cea2d25cdacf	daa74fd2-afa3-408a-b50b-f1ffa476d608	700fedc9527034041ecd3213f00ec865803f2b6e7308d44ae04488fb68f14bbc	2026-02-14 00:59:54.598+00	t	2026-01-14 17:59:55.056222+00
72abd09a-1fd1-47ce-bad1-3ec141ed6f27	daa74fd2-afa3-408a-b50b-f1ffa476d608	fbaa5b7dde9030f42a698633c05de970aedd20ef89eb0cd40c56d0966c8ca865	2026-02-14 02:29:28.092+00	t	2026-01-14 19:29:28.420327+00
ebcb822f-23f9-4d64-8f2c-293e331b1791	daa74fd2-afa3-408a-b50b-f1ffa476d608	65435efc44b37846ce02a5cc554c3fab2df5c6f4e38fa28e3eba3a148adbc54b	2026-02-14 14:29:17.172+00	t	2026-01-15 07:29:17.203714+00
4b80dee2-914a-4a8d-9664-bad548207bec	637ad6c2-4ebe-4a34-9dee-4069973bf704	b5241f789283c3aaf7bb14ebeb9c0fac61713f0cd959416a9a6ce249da9e92f6	2026-05-29 10:02:17.988+00	t	2026-04-29 10:02:18.707562+00
a19b63c9-7f6c-48ac-bc96-7b307f3c27c3	daa74fd2-afa3-408a-b50b-f1ffa476d608	9fe92e8d6d24f65c2573008b59032fb35fb1afecb00e805da54de2876f6cbe57	2026-02-14 14:34:57.169+00	t	2026-01-15 07:34:57.187171+00
9a45a785-8131-45d2-9391-05ecd886544e	daa74fd2-afa3-408a-b50b-f1ffa476d608	e1ca47e1c8c2daa5509fc22195663ff3fae21192aa9b068f7dd5acbb8987aede	2026-02-14 15:03:14.336+00	t	2026-01-15 08:03:14.37327+00
84c535b9-e176-4fe9-9287-d55cc7155921	daa74fd2-afa3-408a-b50b-f1ffa476d608	c4bdc0cf4c5ddfe85ed172853346a1972c46b4e7d08b332a18644aa6d1a3a0ae	2026-02-14 15:10:28.634+00	f	2026-01-15 08:10:28.670821+00
e38356db-194c-4802-b720-0a77c6ea48ab	637ad6c2-4ebe-4a34-9dee-4069973bf704	cf91dab2f8948b1a80b91831046fb57400f65b81c929800bb43070966c859896	2026-02-14 15:34:59.448+00	f	2026-01-15 08:34:59.496773+00
fad828c0-6116-4841-aacb-1349f5b4108e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ba74fc37e035a4b9c83d990d033e4c73469c56caf433c5956fd446c5c62f9698	2026-02-14 15:13:50.511+00	t	2026-01-15 08:13:50.362397+00
2c4f8d80-64cf-4168-ad6c-ba2012603720	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c13687fdf58f385a2bc086e8819375abdb413d5daf32228dabd9c698f77d64d2	2026-02-14 15:45:19.848+00	f	2026-01-15 08:45:19.726794+00
470d9093-5b19-4072-b51a-b604210a109a	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	400b77ed1d34dfec12f2f73b4b04d261ae62281c40078f1e77034c5a29b69a44	2026-02-14 15:45:28.783+00	t	2026-01-15 08:45:28.660682+00
9dc06e2d-1fd4-4f5d-9a68-09e50da7432f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e865b95970841ff5ec841e887fe5c20f0efe08a1c6197d45ab5d90af4a31577b	2026-02-14 16:19:52.015+00	t	2026-01-15 09:19:51.92472+00
9ea8bdb6-64ae-4117-a40a-534554ac8fc1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3e6bd1ed0ae5c427a0a0d520906c6c84b3e1c5d0e0680608cc7c3aff3af90654	2026-02-14 16:24:59.813+00	t	2026-01-15 09:24:59.727963+00
33e611d1-fd33-4cd3-a351-ab128d38b456	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	91fab1e28e30ca9658d3beb630b9dc6a8c66e255a00f9fa0653213bebbc21423	2026-02-14 16:30:25.253+00	t	2026-01-15 09:30:25.17514+00
fb40ed4d-2d77-4225-bc64-0cef10d08d37	daa74fd2-afa3-408a-b50b-f1ffa476d608	733b10785df6f6b6a24d8f533067587a164d9409663fea8ab11378a6d4dc2b06	2026-02-14 15:35:11.789+00	t	2026-01-15 08:35:11.838418+00
3ee60478-5a78-4406-86ec-622840c8d217	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8160ad1a3bbd2dfcd34ea348005dd3732b36892b08be92073899ce206b7f233f	2026-02-14 16:35:46.675+00	t	2026-01-15 09:35:46.599865+00
3887032e-ce43-4435-a766-a72a4dd7c33a	637ad6c2-4ebe-4a34-9dee-4069973bf704	daf66070d8dc4e00354b7714663f310c87dc35b7ec608d6039130e8b2f104d12	2026-05-29 10:02:18.403+00	f	2026-04-29 10:02:19.121641+00
76ecb500-2799-42c8-b5a3-bb4a2926f866	daa74fd2-afa3-408a-b50b-f1ffa476d608	1ce687ae9d4a54aeb930fd00782c817e4f298d2be0e4459c290a667a4dedd446	2026-02-14 16:40:46.554+00	t	2026-01-15 09:40:46.567995+00
56725917-0635-4c63-9cb2-fde65087f27b	637ad6c2-4ebe-4a34-9dee-4069973bf704	33862945424e40a7c5d29a8a5132f9e2f437576df81e1562e8e049789dc60c98	2026-02-14 01:32:10.965+00	t	2026-01-14 18:32:11.43923+00
2b97e6c5-93d1-4491-9526-72f709e32f2a	637ad6c2-4ebe-4a34-9dee-4069973bf704	578302dc0c9e311aa6e5a2cbeaecca379272d9c6ab6cbb6b16629b7b4806bdf4	2026-05-29 10:29:35.679+00	f	2026-04-29 10:29:36.415067+00
9a22cd42-5e0d-43f8-bac4-b001c64c7579	5af5299c-a574-4258-9cdc-53db323686e5	ce5f23d128a26b2d7111d374a650d89370125ff63dc8fa8439e5065fe7c8c439	2026-02-20 06:11:19.534+00	f	2026-01-21 06:11:19.561627+00
2ec081eb-acf9-4bfd-be60-5b45f6b2b287	637ad6c2-4ebe-4a34-9dee-4069973bf704	ccbddbd56222e4bf920939cda1f9e1f683cf28d5e7c051c0f35801fc7da7a00e	2026-03-04 10:16:41.362+00	f	2026-02-02 10:16:41.356196+00
191256f4-db10-4cab-8956-35730007b108	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	aa7ffc89c7dd1748d0ef02107e28ee7fe73607af2c5ca198848f95150dcff993	2026-02-14 16:40:59.256+00	t	2026-01-15 09:40:59.188419+00
ae9f0997-af66-45bd-a699-e842fb1415e6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b0e6c7e647b2f840a74d112bbc4010c2c06c21f5c7d3c0f3742a29d2d755089f	2026-02-14 16:46:36.282+00	f	2026-01-15 09:46:36.217544+00
27b1bbd0-446b-4eef-9ca3-5e9cc66b5804	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b0e6c7e647b2f840a74d112bbc4010c2c06c21f5c7d3c0f3742a29d2d755089f	2026-02-14 16:46:36.283+00	f	2026-01-15 09:46:36.218832+00
fcf73091-a0e8-4a5c-b1cd-8168ca29afd4	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b0e6c7e647b2f840a74d112bbc4010c2c06c21f5c7d3c0f3742a29d2d755089f	2026-02-14 16:46:36.311+00	f	2026-01-15 09:46:36.245846+00
39203cfb-8b36-4b16-a4c2-5eb4dc9f0691	637ad6c2-4ebe-4a34-9dee-4069973bf704	598c437b6e05d98a4b2ccca2bcabb228784225e40251255bddbd77347132abe5	2026-02-15 00:51:50.434+00	t	2026-01-15 17:51:50.274525+00
000e52f9-5c0f-4da0-8ebe-342a62d528aa	637ad6c2-4ebe-4a34-9dee-4069973bf704	5ae268c838e58dcd81cda703c26021b0b2d0aec1ef33e1000d433e3e1baa52ec	2026-02-15 16:24:47.735+00	f	2026-01-16 09:24:47.281461+00
2f3968de-e735-455d-bc59-41854e89c468	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a12d7d847e3d38b1bb3a5d4c326e25570c7ab0173980c2637901ed59fc5bd39c	2026-02-14 16:53:36.184+00	f	2026-01-15 09:53:36.125665+00
ab7611a4-83c1-47c7-91e1-c1306b22ce96	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b0e6c7e647b2f840a74d112bbc4010c2c06c21f5c7d3c0f3742a29d2d755089f	2026-02-14 16:46:36.282+00	t	2026-01-15 09:46:36.215554+00
38db84fa-2c24-44b6-874b-e32e81a5ab8c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a12d7d847e3d38b1bb3a5d4c326e25570c7ab0173980c2637901ed59fc5bd39c	2026-02-14 16:53:36.279+00	f	2026-01-15 09:53:36.218512+00
583a7be9-c6a2-47eb-8e50-ded0c20af2e1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a12d7d847e3d38b1bb3a5d4c326e25570c7ab0173980c2637901ed59fc5bd39c	2026-02-14 16:53:36.325+00	f	2026-01-15 09:53:36.268998+00
d24327df-42a2-4d6e-866d-fe0cc086fa72	637ad6c2-4ebe-4a34-9dee-4069973bf704	3bdb0f7ee19ff3a95526078a78bfcfd430a9f655011a6f3c0c58c5d400a25fcd	2026-05-29 09:01:25.018+00	f	2026-04-29 09:01:25.700911+00
8eee33c2-af07-4727-adc2-72af2a37b190	637ad6c2-4ebe-4a34-9dee-4069973bf704	247890971fcb647d8711a69ee311aaf86f84c99ed6bf55e539838e0402144fec	2026-05-29 10:07:51.237+00	f	2026-04-29 10:07:51.960443+00
35a81846-592e-457b-89aa-3124911caeff	637ad6c2-4ebe-4a34-9dee-4069973bf704	859a4d403ef69841bf2a785181eae84ca0e383580ff609886c81fc3afe3779e2	2026-05-29 10:31:10.067+00	f	2026-04-29 10:31:10.804319+00
3871af21-41c7-4b81-82a1-b1dc145d0781	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a12d7d847e3d38b1bb3a5d4c326e25570c7ab0173980c2637901ed59fc5bd39c	2026-02-14 16:53:36.184+00	t	2026-01-15 09:53:36.124415+00
c8a6c0fa-3837-4a4c-8385-01b14102e846	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ca1c1071b70f9ae1ea06d5f9f74a103516c7fb0778a8dca6ed064d807a4bbdb4	2026-02-14 17:02:03.725+00	f	2026-01-15 10:02:03.675223+00
0f7ed79f-ec61-4850-8d2a-c6f941614dbf	637ad6c2-4ebe-4a34-9dee-4069973bf704	e6f3ee05ca3211e4d053992d2d5d7bb922c3c48b6c7cd564d07fb94b26413182	2026-05-29 12:28:23.462+00	f	2026-04-29 12:28:24.700544+00
f669a4dd-d894-47ef-93de-8661ef727e6a	637ad6c2-4ebe-4a34-9dee-4069973bf704	896f28afb5cf934c342d38d0a4eda96c0b926882ebeeffe5eb6a6b4345b016de	2026-05-29 13:02:33.646+00	f	2026-04-29 13:02:34.095429+00
d41dad20-155e-4bb0-af3b-49fa13ed9732	637ad6c2-4ebe-4a34-9dee-4069973bf704	30303f064768a1d025330c87f3c9610c047cd6a706f6b250e9b12e4a9f95eb7d	2026-06-03 08:33:07.378+00	f	2026-05-04 08:33:05.959844+00
92b24331-bc24-4cb6-abd7-41954dec060d	daa74fd2-afa3-408a-b50b-f1ffa476d608	b1bf0574466c74747d4ccadda8846ff471b6f4e7b9e56f9a2826aa20767a1331	2026-02-15 16:24:57.531+00	t	2026-01-16 09:24:57.074703+00
9c4bda75-4637-48ef-a34c-56071ac0f1ee	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ca1c1071b70f9ae1ea06d5f9f74a103516c7fb0778a8dca6ed064d807a4bbdb4	2026-02-14 17:02:03.727+00	t	2026-01-15 10:02:03.674103+00
8a5b7c37-22f7-4d7a-92a5-d2a18637f65e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fe35ac975dda200ccd4b74493a872ce838c0ffb4a6dbb327a7f8d52d3291adbd	2026-02-14 17:09:53.535+00	f	2026-01-15 10:09:53.490259+00
bef5085d-79c7-4986-a6c9-5558b0ec48ef	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fe35ac975dda200ccd4b74493a872ce838c0ffb4a6dbb327a7f8d52d3291adbd	2026-02-14 17:09:53.534+00	t	2026-01-15 10:09:53.488204+00
8b60e88b-cdba-4331-bf4c-91103b3c365f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8e834fb36682d9c2dc43946b5e93010c6c8d94b49650861f9abe9a381ae9fd47	2026-02-14 17:17:49.415+00	f	2026-01-15 10:17:49.376929+00
3a6d49f8-7743-446c-a429-3c2b4cb7d311	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8e834fb36682d9c2dc43946b5e93010c6c8d94b49650861f9abe9a381ae9fd47	2026-02-14 17:17:49.417+00	f	2026-01-15 10:17:49.378446+00
e62da365-75ed-4984-bcf5-3b21e02ad828	daa74fd2-afa3-408a-b50b-f1ffa476d608	ae1c151763c21b34d7141374c0568a33bb897129fd6693e5a6510a68dca1ba03	2026-02-14 18:05:38.894+00	t	2026-01-15 11:05:38.941292+00
bfa896de-0cd6-4fc9-ba58-f1176f41af77	daa74fd2-afa3-408a-b50b-f1ffa476d608	247ba7aa1e87e0d9f134a37e03df310ab2be60356c71a2f0fa8d793e86fd9286	2026-02-15 00:50:18.479+00	t	2026-01-15 17:50:18.321253+00
a2b367f3-5dd3-43cc-a550-0d657382edbd	daa74fd2-afa3-408a-b50b-f1ffa476d608	50133ede862af99ba940a6138acf16524cb97879c663363fc9e1bcb217aca133	2026-02-15 00:54:18.947+00	t	2026-01-15 17:54:18.782538+00
666d5aad-b663-4a18-8bfa-3c08f0681ea4	daa74fd2-afa3-408a-b50b-f1ffa476d608	099a0c36b04a163174b5b5fae2ae6e2c26c145220b70a35da68161f70067a253	2026-02-15 01:35:52.818+00	t	2026-01-15 18:35:52.674802+00
871b850a-14a7-4a3d-8ca6-a239de95ee3b	daa74fd2-afa3-408a-b50b-f1ffa476d608	b0f70c1457896006ec79c27303aa6d8154f61d13fc7f5b748dd36eb6609943cf	2026-02-15 15:26:21.724+00	f	2026-01-16 08:26:21.234413+00
b2100424-f0ec-4733-a1a5-68cf69031de9	daa74fd2-afa3-408a-b50b-f1ffa476d608	05e2befe044fc2754d53332f691f1729e06a504cb7a853c6594fd32673811a01	2026-02-15 15:28:46.941+00	f	2026-01-16 08:28:46.453786+00
6208d63d-64c8-4e33-9bde-864260cdaed9	637ad6c2-4ebe-4a34-9dee-4069973bf704	4aa3dd6140a53cb89aabb4437564c2d3e0e36037fef757c06a70bdcd1c1b8736	2026-02-15 15:54:33.871+00	f	2026-01-16 08:54:33.396854+00
325f6b96-357a-42b4-bce2-a3af091ca7b9	637ad6c2-4ebe-4a34-9dee-4069973bf704	8d288a4b90b691d3899d8ddd3115af33b0b22046486803c195cc57432524ddfb	2026-02-15 17:43:46.316+00	f	2026-01-16 10:43:45.712969+00
7a31e55e-19f3-4ad3-bad7-571379ba548c	637ad6c2-4ebe-4a34-9dee-4069973bf704	333d4876c63cd61138712dda00899b94a399313cc1a516e123881a46edbb614f	2026-02-15 17:45:21.647+00	f	2026-01-16 10:45:21.044865+00
6d2f47a8-00ad-43c8-a1b9-d80af517b058	daa74fd2-afa3-408a-b50b-f1ffa476d608	bdf7f04b3aaaf3a4e49a18cdc6eccd6b3e714771fd9e46aef1f9dfd2378303a6	2026-02-15 17:39:06.843+00	t	2026-01-16 10:39:06.251565+00
f1aea7e7-11d6-4be0-ab5c-c6aa38e0f67b	daa74fd2-afa3-408a-b50b-f1ffa476d608	2e92e67349406e51caf54ac2a44921661cf7697ac908d384a0e552b3186b7712	2026-02-15 18:19:23.323+00	t	2026-01-16 11:19:22.738337+00
410a7c10-a32c-49da-8eab-392dec83f23b	daa74fd2-afa3-408a-b50b-f1ffa476d608	caa0ad8f90bac8cc48f690335d3e90d8b8ee19de886d6cc91047ea93f1f5eb6b	2026-02-15 18:24:26.484+00	t	2026-01-16 11:24:25.905927+00
f85a6ef5-2c60-454b-8eeb-99d280e257bc	daa74fd2-afa3-408a-b50b-f1ffa476d608	38e38fe4490a197de196d28a59c53cf502f42777533d863ff1433360ed5f32f9	2026-02-15 18:39:16.943+00	t	2026-01-16 11:39:16.374313+00
224fb256-254f-48e7-84f6-66ed4cf2a04a	daa74fd2-afa3-408a-b50b-f1ffa476d608	59514b94367f588ac8abd47a407695a563575da1e59e2f7529823f54474a4e74	2026-02-15 18:53:15.607+00	t	2026-01-16 11:53:15.039433+00
7c2d5ada-37fd-4c77-a373-57b237495d2c	daa74fd2-afa3-408a-b50b-f1ffa476d608	15bd8e5d26c47f23f8113febb2b845757dadddb59a599e0f757946d051e7df34	2026-02-15 22:18:15.745+00	t	2026-01-16 15:18:15.062689+00
2f638f9a-f3cc-49a0-a3c9-23f10beca49e	daa74fd2-afa3-408a-b50b-f1ffa476d608	528a1f1acf24761799b6bac6d0d2016422d9de735cb46812105583e5997155e8	2026-02-15 22:24:08.595+00	t	2026-01-16 15:24:07.934604+00
03f6fd84-4ae1-47ac-a348-5619c8268b39	daa74fd2-afa3-408a-b50b-f1ffa476d608	abf7b3cc3040a7844e26978b9527ffc22037d86102408cf4acd8bf52e381ff33	2026-02-15 23:06:13.354+00	t	2026-01-16 16:06:12.261873+00
ac429ad8-da01-4c8e-9e26-8f42b17b0a81	daa74fd2-afa3-408a-b50b-f1ffa476d608	54dfe6c92c2dee2f9a1dcfab7826734b720b10ee70e0a744d2f8a8e235124cac	2026-02-15 23:25:39.345+00	t	2026-01-16 16:25:39.104587+00
810ae77f-367c-4cff-9f4c-eba35d3017ae	daa74fd2-afa3-408a-b50b-f1ffa476d608	a6e430e3962a0537d655fad296c532af13d85ec0cadb5c86817219ba2b0b9b56	2026-02-16 02:44:36.03+00	f	2026-01-16 19:44:35.828038+00
95089fef-5208-4145-bd3d-d792f4a2acb4	daa74fd2-afa3-408a-b50b-f1ffa476d608	1b9eb1eea8d23b0c543852c02fe07695ef032b9eac170be34b2a6c2d8d0e032f	2026-02-15 23:51:06.319+00	t	2026-01-16 16:51:05.993017+00
c7894a40-cd88-437c-b3f3-ea13e0ee2692	637ad6c2-4ebe-4a34-9dee-4069973bf704	ce045ce3e21711e805128706cd29facc42b814c4a90cd15a26c75ac3c13b8365	2026-02-16 02:45:57.844+00	f	2026-01-16 19:45:57.643857+00
7a09379f-0f56-4150-ad56-bf510d1a3c35	daa74fd2-afa3-408a-b50b-f1ffa476d608	c5be334be5125a42cb769a66c0544c82715d16aef75299371f4f41ff33716ed9	2026-02-16 02:45:44.014+00	t	2026-01-16 19:45:43.813066+00
7ef41a34-7276-4f6d-8e3b-54908f0817bf	daa74fd2-afa3-408a-b50b-f1ffa476d608	f5e1cba3929495d22e43ba360f2d60e2c0e8dfa698abb9682ca3eafb00211bc4	2026-02-16 02:54:55.666+00	t	2026-01-17 02:54:55.471984+00
5758c15c-c259-40a9-8ca2-0be532e84db4	daa74fd2-afa3-408a-b50b-f1ffa476d608	b8c06922147037e2f2851652e781652de749d9b72ff27b27a1849366551e2960	2026-02-16 03:02:02.835+00	t	2026-01-17 03:02:02.645019+00
40f5e8c9-c6da-4d09-aaa0-7917c4987d5e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ba203758a47b2bcf1b03e3c96bf68d75bbdc8e228dcf6c3195005d9342195e3b	2026-02-21 02:34:29.052+00	f	2026-01-22 02:34:29.081287+00
520edd16-416b-422d-bf48-aa3f19d39628	637ad6c2-4ebe-4a34-9dee-4069973bf704	e5f0fea05e561b6b42ed0fcdfc4a814da63828e6f9cfd8323898e12145252a60	2026-02-16 17:26:08.616+00	f	2026-01-17 17:26:07.329425+00
0165c2c2-edd4-4fe6-b5d6-1a09b1e51864	daa74fd2-afa3-408a-b50b-f1ffa476d608	ead9f0994d79b1ebcf86325dd1aae8ecbecb52141f636022d4371fbc936d50ee	2026-02-16 17:25:28.996+00	t	2026-01-17 17:25:27.709381+00
0cb17466-2a01-4b88-b7fc-1ae07f5d3e90	daa74fd2-afa3-408a-b50b-f1ffa476d608	54fdf3143a3787becf35e6ef93cdc9103fc79be78c12df365ec45e91733a164c	2026-02-16 17:55:32.001+00	t	2026-01-17 17:55:31.014147+00
6b73c715-099a-4b3b-b385-fa4e74e7b685	daa74fd2-afa3-408a-b50b-f1ffa476d608	6e7251da533b0412953417c8fe8659e44bfcb2c3274af1aa8fbbb210c3e96b7c	2026-02-16 18:05:08.511+00	t	2026-01-17 18:05:07.5064+00
28e3a10c-a519-4139-b5cb-e46b0287a32d	daa74fd2-afa3-408a-b50b-f1ffa476d608	973dfdfea3e49cfe6a9b5853a0ff2d34061f156c20104f2536cf75e86ee0943d	2026-02-16 18:14:40.841+00	t	2026-01-17 18:14:39.858458+00
92bfa48c-57a1-4ac3-8561-c87d06ed6a83	daa74fd2-afa3-408a-b50b-f1ffa476d608	de305e3722024e252a23fd47f642a2d31ce5342dda18d7a46b21899d9c90c99c	2026-02-16 18:20:22.175+00	t	2026-01-17 18:20:21.179644+00
08de78f4-025f-4291-a0e5-c9986905ee1a	637ad6c2-4ebe-4a34-9dee-4069973bf704	3f76144c3a25591c0fd98f51c8c028223e2855538f20d63d336d39b3fdbb0525	2026-02-17 01:06:28.288+00	f	2026-01-18 01:06:27.101237+00
04db5ba1-858c-4c49-bc9e-2b32cb4232c1	daa74fd2-afa3-408a-b50b-f1ffa476d608	093fc01164c84c7ac8da5bc4780121df770c9d19c48aa83c988806092c3f3350	2026-02-16 19:17:21.335+00	t	2026-01-17 19:17:20.372698+00
07064263-c390-4f95-9024-da5e696551b8	daa74fd2-afa3-408a-b50b-f1ffa476d608	ab3a829e25861b05fb2c790d74e37dd6b80502c53f2405fe32e58667b56cd9b0	2026-02-16 19:37:01.958+00	t	2026-01-17 19:37:01.000131+00
deba42b8-1548-4f66-a4bd-1191bc0ba481	daa74fd2-afa3-408a-b50b-f1ffa476d608	4ad84c48cbfd2b32e4455051fabc3230a6ef3608fe5da2a2f249fa3134e845d7	2026-02-16 19:45:47.616+00	f	2026-01-17 19:45:46.6624+00
84a04a1e-a21b-4a03-83a4-a32166e24892	daa74fd2-afa3-408a-b50b-f1ffa476d608	ab3a829e25861b05fb2c790d74e37dd6b80502c53f2405fe32e58667b56cd9b0	2026-02-16 19:37:01.963+00	t	2026-01-17 19:37:01.00505+00
33fd450c-5c5c-47d2-8c89-5cab2ea2be26	daa74fd2-afa3-408a-b50b-f1ffa476d608	a5b18df97c7ec8c3f697cdb9b0e5f5d929ac6e4f58887615b952266a9e67afb3	2026-02-16 19:45:48.616+00	t	2026-01-17 19:45:47.663597+00
a4b33b90-1c6b-41bc-811a-9883b07adb18	daa74fd2-afa3-408a-b50b-f1ffa476d608	21e44a9c08a7a14b963d05b94034fc73c9e7f636ceebc25f9ac977cf4a0867c6	2026-02-16 19:54:50.937+00	t	2026-01-17 19:54:49.988842+00
86d6e4d4-7b81-4790-ab7a-1e29e6e6dfac	daa74fd2-afa3-408a-b50b-f1ffa476d608	572a451b39d5c4339953a3e831ae8f0d61055f7a5d917b14c06daa334d5b4236	2026-02-16 22:12:37.681+00	t	2026-01-17 22:12:36.802402+00
a0622031-c213-44a0-b24f-3950557d42b7	daa74fd2-afa3-408a-b50b-f1ffa476d608	4beb2af14e1eb0a29ecf945e758783a764df27dcc24f85296fee007c48d08a5a	2026-02-16 20:01:52.812+00	t	2026-01-17 20:01:51.871533+00
ebbc7be7-2f6c-4b6c-a0d4-3c2d84e3febc	daa74fd2-afa3-408a-b50b-f1ffa476d608	406d461185858d2c777a2c5904d89dc37de5d0138a9360da78f37988ee458c82	2026-02-16 20:07:05.639+00	f	2026-01-17 20:07:04.693887+00
7ae21d7c-a0c7-4477-8575-dc304479d15e	daa74fd2-afa3-408a-b50b-f1ffa476d608	406d461185858d2c777a2c5904d89dc37de5d0138a9360da78f37988ee458c82	2026-02-16 20:07:05.64+00	t	2026-01-17 20:07:04.693547+00
e3583625-90f1-46a1-8be5-cf51c01b7aa8	daa74fd2-afa3-408a-b50b-f1ffa476d608	79df6aa7e8fdccb125589d0c08bc132756c028d9194809726c04ad981eefe221	2026-02-16 21:10:15.77+00	f	2026-01-17 21:10:14.860048+00
0ffba93e-ac63-41eb-857e-20f0ed0dfe43	daa74fd2-afa3-408a-b50b-f1ffa476d608	79df6aa7e8fdccb125589d0c08bc132756c028d9194809726c04ad981eefe221	2026-02-16 21:10:15.765+00	t	2026-01-17 21:10:14.856801+00
5271b743-277b-4be2-a6b6-17ecd8e718d4	daa74fd2-afa3-408a-b50b-f1ffa476d608	9858586b8492020641cd5726b6dd0efda697b92bd85e1176846a355785e419ae	2026-02-16 23:20:34.552+00	f	2026-01-17 23:20:33.314948+00
9b2b4b07-9b63-4d64-838c-fea0a4931bb8	daa74fd2-afa3-408a-b50b-f1ffa476d608	0d5c464ff7a4b6a754f92c2044b1174abf70b0c9b2170081d6ac1417a3868c21	2026-02-16 21:17:47.751+00	t	2026-01-17 21:17:46.852913+00
db924fb5-c5d0-46a3-8200-23d0f725fda5	daa74fd2-afa3-408a-b50b-f1ffa476d608	ec07add76a9bae96317ebf7eca14487ed74f5767c75e426eb2dc8a9a826783bd	2026-02-16 21:26:07.06+00	f	2026-01-17 21:26:06.157705+00
79258bc2-5853-43ac-a791-f1ec07df9e65	daa74fd2-afa3-408a-b50b-f1ffa476d608	ec07add76a9bae96317ebf7eca14487ed74f5767c75e426eb2dc8a9a826783bd	2026-02-16 21:26:07.056+00	t	2026-01-17 21:26:06.152569+00
624da047-7a39-454b-8c9c-5ebb3a7327de	637ad6c2-4ebe-4a34-9dee-4069973bf704	3e9d66b5d30b52a1ff13d0b1b1a83e77e28dddcd1a6753990c58c05348c5d086	2026-02-17 01:07:53.174+00	f	2026-01-18 01:07:51.990659+00
488a4f8e-e4f0-4115-90eb-e7ac87e4a4a8	daa74fd2-afa3-408a-b50b-f1ffa476d608	9858586b8492020641cd5726b6dd0efda697b92bd85e1176846a355785e419ae	2026-02-16 23:20:34.545+00	t	2026-01-17 23:20:33.308347+00
40dd8f12-e027-45af-a6d7-7a837215bed3	daa74fd2-afa3-408a-b50b-f1ffa476d608	c320d44ae8fbbcdaf22c0df631602720295119d05dd40f3cbbc248779201c63e	2026-02-16 23:33:12.859+00	f	2026-01-17 23:33:11.631756+00
9f2f8bd5-e3e1-43ca-aa2d-e78a6b84ed1a	daa74fd2-afa3-408a-b50b-f1ffa476d608	c320d44ae8fbbcdaf22c0df631602720295119d05dd40f3cbbc248779201c63e	2026-02-16 23:33:12.8+00	t	2026-01-17 23:33:11.566092+00
0b0bdeb3-c7a3-403f-b4dd-a5fd1bd177cf	daa74fd2-afa3-408a-b50b-f1ffa476d608	6b2c7320c02952e61c5dbb8d74f9a833c0e63b48a8d267106b5c245f85a51f1e	2026-02-16 23:50:15.471+00	t	2026-01-17 23:50:14.239262+00
2c31ab80-6c19-4881-82fa-b45459bf1262	daa74fd2-afa3-408a-b50b-f1ffa476d608	650046d74299da1b373a89c6135f274657ac33094220382373cd48698ba219c7	2026-02-17 00:09:24.25+00	t	2026-01-18 00:09:23.034868+00
953f69f4-27c4-4baf-8797-35db3a7f3213	daa74fd2-afa3-408a-b50b-f1ffa476d608	48f381678a7164ac732a0c83528a954a00bdb9db37a3920fe5e4d8e545279d4c	2026-02-17 00:15:21.484+00	t	2026-01-18 00:15:20.27458+00
35867b22-d1aa-4225-9ca6-6ff6c7bde722	daa74fd2-afa3-408a-b50b-f1ffa476d608	6621e3ef1ed88fb9ec77066dcf33220fad1926351074d2be06a0bb62ff3a20a0	2026-02-17 00:21:20.474+00	t	2026-01-18 00:21:19.265771+00
d70eebbd-445a-4012-8794-fcd10d74d356	daa74fd2-afa3-408a-b50b-f1ffa476d608	1f906f1cd0d558ca771a42d12e4866aa736d6a31761d49a0f4f84d768bb5bbab	2026-02-17 00:30:15.208+00	f	2026-01-18 00:30:14.003367+00
19ffd347-3fc3-4307-a9aa-8fc38e49d6c2	637ad6c2-4ebe-4a34-9dee-4069973bf704	8d9bf566e6495fa940030392b234ac8d56bc9ef6095ffc346149ffae57cf15fe	2026-02-17 00:30:36.364+00	f	2026-01-18 00:30:35.159686+00
02a5795a-313c-45ef-bf98-5a25f5bee78d	637ad6c2-4ebe-4a34-9dee-4069973bf704	9e145efedd63b5b30ac5bae9ea0e5b9ee5915c46b6be9992939ebada6298134c	2026-02-16 18:21:29.12+00	t	2026-01-17 18:21:28.128984+00
deb3ba00-b8e2-4304-80ca-274c5006873b	637ad6c2-4ebe-4a34-9dee-4069973bf704	55a137ccbe02b9c85fedf300c8ae6abfc52c526e351c26484c628dda124339e5	2026-02-17 00:53:42.819+00	f	2026-01-18 00:53:41.625661+00
71afc008-ef40-45e0-a256-ceea445a9fdf	637ad6c2-4ebe-4a34-9dee-4069973bf704	c82cdfb4253d6fece1461df45243aca9148d27bdf5dbcdb2fa5fdaa2bc55e5c8	2026-02-17 01:09:21.483+00	f	2026-01-18 01:09:20.298456+00
9bb7a962-7153-4dd1-8322-5daa47bdf596	daa74fd2-afa3-408a-b50b-f1ffa476d608	8835599300e33c493fd47259a5184a9da148d96e499edb1bb73daa5695337f5a	2026-02-17 00:53:59.365+00	t	2026-01-18 00:53:58.165462+00
81c3df20-14aa-4d80-88ec-e529fb305478	daa74fd2-afa3-408a-b50b-f1ffa476d608	7af39605a04bdc4549dee17c54348f9e3660e832f90aaaf72d56804586b6d1cc	2026-02-17 01:24:02.38+00	t	2026-01-18 01:24:01.217616+00
b610d262-c2e7-40a5-ac13-32c20df2d47b	daa74fd2-afa3-408a-b50b-f1ffa476d608	a2a741d79d0fe82a0e94ba1dfeac1a630a7685b58aba524f46ae90afcf0dd462	2026-02-17 01:47:48.799+00	t	2026-01-18 01:47:47.634646+00
1b05a113-6886-466e-a60d-4d5a1a465277	daa74fd2-afa3-408a-b50b-f1ffa476d608	913d46b86ab2b5cd7eae8cacb2ee1ceadf642cad33eea58d5cebe7ed0198d70b	2026-02-17 01:40:26.146+00	t	2026-01-18 01:40:24.98539+00
422aca23-d6fd-478b-b2eb-1961327baa5a	daa74fd2-afa3-408a-b50b-f1ffa476d608	a2a741d79d0fe82a0e94ba1dfeac1a630a7685b58aba524f46ae90afcf0dd462	2026-02-17 01:47:48.805+00	f	2026-01-18 01:47:47.64563+00
2440cb81-7897-474c-a218-851cb1f8770c	daa74fd2-afa3-408a-b50b-f1ffa476d608	31e24f3cee0941b543d6c0a0100e6fff047ad2286362f1b418b64e0d65af01e6	2026-02-17 02:33:07.956+00	t	2026-01-18 02:33:06.814155+00
06bda8c4-798b-4b5e-b67a-6a3eba988598	daa74fd2-afa3-408a-b50b-f1ffa476d608	ffeab96abb859593fdcb14ee95d7c1da2e7579374dc129a9ce0399f07396f445	2026-02-17 02:42:20.635+00	t	2026-01-18 02:42:19.505855+00
477eea11-0cb9-43a1-a9c9-28134c7fc189	daa74fd2-afa3-408a-b50b-f1ffa476d608	15ba144ca32654129290680e5588df89b978f1f0243386018cc684c65c8c9301	2026-02-17 02:48:44.391+00	t	2026-01-18 02:48:43.255887+00
6dd4409f-2bcf-4092-a5e7-a371ea54ac5a	637ad6c2-4ebe-4a34-9dee-4069973bf704	9145c2352f2cc5ba214462ed7ce016bf3522aa150384fa9457c883f9aecc861d	2026-02-17 01:09:27.38+00	t	2026-01-18 01:09:26.194942+00
7a2efc71-23ce-497e-ae5b-b2199308d245	637ad6c2-4ebe-4a34-9dee-4069973bf704	df6cdf3c7eb3b4aa8dd8e1db4767a82bcc8db7a8a7f201eae9707125c4e97869	2026-03-04 10:17:09.908+00	f	2026-02-02 10:17:09.904178+00
b3d12c07-324d-4a21-b1ee-869960ff405b	daa74fd2-afa3-408a-b50b-f1ffa476d608	bd6f055a71d8bfec783b829b7a31759409aa9c8ab46062560a3e5c75444a2766	2026-02-17 02:58:01.124+00	t	2026-01-18 02:57:59.994389+00
67c18cd6-c67d-43f3-a987-6bfc31977169	daa74fd2-afa3-408a-b50b-f1ffa476d608	192f14832b371a0ce8686fea9acd543fff3aee36c00c07b31fb3f1be3f8e7d0c	2026-02-17 03:07:07.403+00	t	2026-01-18 03:07:06.288622+00
5d147dae-796b-47b5-9767-d08c63e00a19	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0163e93647bd05625baa865d981e939581034bc74642760853d4248cf1bbc9dd	2026-02-17 15:03:23.306+00	t	2026-01-18 15:03:23.973137+00
43cc08bc-0c4e-447f-9437-8c7394e3f647	daa74fd2-afa3-408a-b50b-f1ffa476d608	73e73f53a56f77dd0d443b702b4a26e51fd70c4a0e511c7413b75ea15b5b2a81	2026-02-17 03:12:19.499+00	t	2026-01-18 03:12:18.377821+00
d0733731-526a-4b0f-8ace-b4e444975ebc	daa74fd2-afa3-408a-b50b-f1ffa476d608	90323c7c482b294e30f637f0c08b3d73e58cc2e972e245930109a375aa3d5fdb	2026-02-17 03:38:04.86+00	f	2026-01-18 03:38:03.688751+00
4bba07c9-acd3-49c0-ae94-1c2b6469a29c	daa74fd2-afa3-408a-b50b-f1ffa476d608	90323c7c482b294e30f637f0c08b3d73e58cc2e972e245930109a375aa3d5fdb	2026-02-17 03:38:04.809+00	t	2026-01-18 03:38:03.638661+00
0b4b833e-1422-4713-b235-15ba300d2ff1	daa74fd2-afa3-408a-b50b-f1ffa476d608	4d1e865a7ee6e16f1fa003ceba3f5fae86a1ea014c05b1c5e7bf6a72f54f702a	2026-02-17 03:47:35.312+00	f	2026-01-18 03:47:34.139985+00
49defc8b-006d-4c3a-b7de-effe6325cf2c	daa74fd2-afa3-408a-b50b-f1ffa476d608	4d1e865a7ee6e16f1fa003ceba3f5fae86a1ea014c05b1c5e7bf6a72f54f702a	2026-02-17 03:47:35.252+00	t	2026-01-18 03:47:34.07748+00
5cfec5c4-67ca-4230-9171-2f3a67d43f5f	daa74fd2-afa3-408a-b50b-f1ffa476d608	d85db4381ad4d030606dff770549e41f474a753716dbdda08688e857295b8d20	2026-02-17 03:55:44.885+00	t	2026-01-18 03:55:43.713143+00
9c597914-cb92-423b-91e1-4e51607baf50	daa74fd2-afa3-408a-b50b-f1ffa476d608	cf110ef7e702d2ead18844d198e3c20aa84292c87fc625367faeb2fd4f2a349c	2026-02-17 04:01:42.872+00	f	2026-01-18 04:01:41.704568+00
9b670870-6b3c-40ae-92d9-59da4aa5b91d	637ad6c2-4ebe-4a34-9dee-4069973bf704	4da3cfe263f039c3cd8442f0feb73c0a2a9ca81c8767684702e1ff558f7ade38	2026-02-17 03:55:40.839+00	t	2026-01-18 03:55:39.666889+00
99b05476-acda-4601-b528-e8603fda1a46	637ad6c2-4ebe-4a34-9dee-4069973bf704	ab22bf841adcf0a4afce1f9b5a140b3c5b59c8a9b301f02a68b0528a55322b31	2026-02-21 02:34:29.855+00	f	2026-01-22 02:34:29.883755+00
8aab57ea-439f-49bb-b74b-0969b7ab0139	637ad6c2-4ebe-4a34-9dee-4069973bf704	b9509f8b878f15aa249879d2d522bf762b23ba088aaa71c8e46047dd0f0b889e	2026-03-04 10:17:56.841+00	f	2026-02-02 10:17:56.838324+00
f2fbb923-7329-4cc7-9552-cf3369d30df2	637ad6c2-4ebe-4a34-9dee-4069973bf704	d221924cabb1ac5fc04c9f3867de3ae43cb213f0cf103212494730afe5825007	2026-05-29 09:04:16.701+00	f	2026-04-29 09:04:17.386143+00
7e8750b8-7a68-481b-840c-8094ae7f37b5	637ad6c2-4ebe-4a34-9dee-4069973bf704	b37d140862a2f4be091dcce2ed5284dbccb1ffa7d41dda342c20717c4cfcc7de	2026-05-29 10:08:17.552+00	f	2026-04-29 10:08:18.276679+00
139c4457-4248-4056-893b-c26e9d0a43f0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	68c1a0f0c1049c1af8a63a05f135e4a69703c977f4391138bf05787965e0cfc6	2026-02-17 15:35:22.624+00	f	2026-01-18 15:35:23.316627+00
4cc47cef-0707-4b57-9ce3-188bc4ec03b6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e1fdcb68d6f3a8de85e977a2e8767e843828bdc2763f993ebe3a6e53571b9033	2026-02-17 10:58:56.153+00	t	2026-01-18 03:58:56.621744+00
8a9d0d09-9f97-46c1-9b3b-3b3c8e5620cf	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	da0316e5d729cf88d7aa04471d729e5633b1c3f434171d66197dd423da143b37	2026-02-17 11:29:12.544+00	f	2026-01-18 04:29:13.029125+00
0268266a-66b6-4969-875a-200aa2f3802c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	da0316e5d729cf88d7aa04471d729e5633b1c3f434171d66197dd423da143b37	2026-02-17 11:29:12.546+00	f	2026-01-18 04:29:13.039861+00
e15fac8f-0c45-4dff-8275-e672b0963e86	637ad6c2-4ebe-4a34-9dee-4069973bf704	b3a36e1c7149fedc534e95cb121eb6b263acf385a4aa84c8e2be7a8cab6167bd	2026-02-17 04:03:29.487+00	t	2026-01-18 04:03:28.31648+00
433d08fc-c8dd-4afc-bc7e-396b8c9dda73	637ad6c2-4ebe-4a34-9dee-4069973bf704	9b44eb15a8c9ba501ddea4cc2643ec04e3461a8ab79432c273de8cc3a244afec	2026-02-17 13:35:05.903+00	f	2026-01-18 13:35:05.020912+00
108bf83a-b8f8-4ca5-9bfa-ea3348447957	637ad6c2-4ebe-4a34-9dee-4069973bf704	d9f91acc526a256bb3c2a00055edea4afaddf0790ddd9750bf81afe82ba1bed5	2026-02-17 14:07:20.643+00	f	2026-01-18 14:07:19.789971+00
591ed4aa-c813-4563-bfdf-47642abd613a	637ad6c2-4ebe-4a34-9dee-4069973bf704	be296a5186de7410f7af2d044a707e2a5986dd1eac42cd204ad86ba470130f22	2026-05-29 10:31:47.947+00	f	2026-04-29 10:31:48.684575+00
8daac3fd-a96b-477a-a96b-e5f547e57483	637ad6c2-4ebe-4a34-9dee-4069973bf704	8c50571f447952753b0afbf3a93b71b37c25580879e48100a09ff59aca7109f7	2026-05-29 12:29:09.864+00	f	2026-04-29 12:29:10.288361+00
f164e2d7-d9b2-4985-8f18-2b5ea8f34b95	637ad6c2-4ebe-4a34-9dee-4069973bf704	3b3d45602d5960d8e9bd1c1ce0b59a322c4fc941e427c9ce0977711cf614a6e7	2026-02-17 14:26:06.055+00	f	2026-01-18 14:26:05.21011+00
0c3af830-ea41-4b6a-80f0-47730e7a3f64	637ad6c2-4ebe-4a34-9dee-4069973bf704	c094ffe6010483ab2876a6172888cbd9a6259ae5471a7a1ce45ad7deccba951e	2026-05-29 13:02:51.513+00	f	2026-04-29 13:02:51.959477+00
a6ab921c-68fc-474d-b582-3e336c40acf3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2979455fa6ee868199459a8889fc3b113c9609540fa6be3e3ac859e3a398eec1	2026-02-17 14:37:26.75+00	f	2026-01-18 14:37:27.391631+00
0840b18e-3165-4233-b010-56c60065fda0	637ad6c2-4ebe-4a34-9dee-4069973bf704	6cb752eb25ed02fe7dbfdd0ee1af1650eb2920b7751aaebca5ca490e25a3f3a8	2026-06-03 08:34:48.502+00	f	2026-05-04 08:34:47.085199+00
2434dfc5-bc85-4d73-8357-384eac7bad27	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	88b70a19563ca0f872a2de3bf58de71642f7e6f24654325c736f8716a7e27b74	2026-02-17 14:54:41.655+00	f	2026-01-18 14:54:42.312246+00
e2df0c6e-40d3-4abc-9f9a-2dd6e063743a	637ad6c2-4ebe-4a34-9dee-4069973bf704	a5125aee4b63cfe734684f1c95bf8046c675c70b1e7b162dea19e6809d3ca0c0	2026-02-17 15:22:13.916+00	f	2026-01-18 15:22:13.156548+00
f1cf252d-b353-4cbf-8b97-d5d742d7b039	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	68c1a0f0c1049c1af8a63a05f135e4a69703c977f4391138bf05787965e0cfc6	2026-02-17 15:35:22.626+00	f	2026-01-18 15:35:23.31947+00
d714bee4-7b86-4c93-9c4c-837d7ef43783	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	68c1a0f0c1049c1af8a63a05f135e4a69703c977f4391138bf05787965e0cfc6	2026-02-17 15:35:22.643+00	f	2026-01-18 15:35:23.32417+00
210e4b2d-19db-4bf8-82f0-9afe3891af14	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	68c1a0f0c1049c1af8a63a05f135e4a69703c977f4391138bf05787965e0cfc6	2026-02-17 15:35:22.714+00	f	2026-01-18 15:35:23.412293+00
6ab4423a-6350-4444-a966-82ed4e1cfff5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	231934ae23917eb95dcc031b0bb11202d4bf61cb00c01d5682464363a42b6413	2026-02-17 15:40:41.577+00	t	2026-01-18 15:40:42.263694+00
0723ecc9-ab3e-465f-9897-4ca703916083	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	68c1a0f0c1049c1af8a63a05f135e4a69703c977f4391138bf05787965e0cfc6	2026-02-17 15:35:22.567+00	t	2026-01-18 15:35:23.258108+00
6d16e344-584e-41c2-9cbb-d17fa64c03f2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	231934ae23917eb95dcc031b0bb11202d4bf61cb00c01d5682464363a42b6413	2026-02-17 15:40:41.708+00	t	2026-01-18 15:40:42.408205+00
de136ef5-920d-44a8-bd8a-bec21b972ba1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0a5639bf9d6d81336aee4f415b2b2e1a2fd65266b8c61d51caf7a6395a7fa55f	2026-02-17 15:45:56.839+00	f	2026-01-18 15:45:57.534489+00
b55b5987-f1ae-4a90-9c17-5cefbbc1895f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0a5639bf9d6d81336aee4f415b2b2e1a2fd65266b8c61d51caf7a6395a7fa55f	2026-02-17 15:45:56.692+00	t	2026-01-18 15:45:57.404842+00
c9da7f20-68bb-4861-a3cd-0319e0efc44a	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0a5639bf9d6d81336aee4f415b2b2e1a2fd65266b8c61d51caf7a6395a7fa55f	2026-02-17 15:45:56.644+00	f	2026-01-18 15:45:57.368735+00
869f5e6c-2426-4e75-a7ea-8ec3ab1f14c5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0a5639bf9d6d81336aee4f415b2b2e1a2fd65266b8c61d51caf7a6395a7fa55f	2026-02-17 15:45:56.692+00	f	2026-01-18 15:45:57.398841+00
4fe84ebb-d93d-4aa9-b3ef-09819356bd94	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0a5639bf9d6d81336aee4f415b2b2e1a2fd65266b8c61d51caf7a6395a7fa55f	2026-02-17 15:45:56.977+00	f	2026-01-18 15:45:57.694387+00
02af58c0-da26-453f-b4d7-46c76f3c3eb5	daa74fd2-afa3-408a-b50b-f1ffa476d608	7c758c51019df5a7a8ad6cc94634c3ea17ab27fab9fe8ce18eebce4f7fb23aaf	2026-02-17 15:51:12.515+00	f	2026-01-18 15:51:11.156103+00
ee473f3b-0ab1-4c21-9282-96696e981b71	637ad6c2-4ebe-4a34-9dee-4069973bf704	3779b2d50bdceab7d7d8170aa0d644727d486eb63fa3d5b11cd25338e039c123	2026-02-17 15:58:11.628+00	f	2026-01-18 15:58:11.844809+00
c6d508f7-5d76-45bf-83aa-4f2be71d218b	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	017e8236d03d50398ff78f66f0f109da47e15a9e0fb5b25afacfd9eb6c5f1cf0	2026-02-17 15:52:51.081+00	t	2026-01-18 08:52:51.785844+00
5e19e87e-1d5e-4b1b-9d74-9cf6864ac435	daa74fd2-afa3-408a-b50b-f1ffa476d608	07d811e9fb5adb45deaf2c162dc1d1f55f397ad4871d3e0f49057c66b12339ef	2026-02-17 16:01:25.018+00	f	2026-01-18 16:01:23.647089+00
04767bd7-6ce7-40b8-8e4f-1d0fd2e2eebb	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3547c8acb672ac11324b92a496ca1fc7a497b9362db0e0ba0aee1f166c88ae0e	2026-02-17 15:58:19.485+00	t	2026-01-18 15:58:20.196306+00
e6d69372-7840-4046-af3b-2635af93986c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	06e948f463912e289d7b81e00973cc924fcd4b0e5ad58831b9c5d2541747b30b	2026-02-17 16:07:32.552+00	t	2026-01-18 16:07:33.269349+00
a7a70e6f-93e9-4e47-8370-ff7a18a7d36f	daa74fd2-afa3-408a-b50b-f1ffa476d608	2101730f19006eeda1ae2af0ed13a9d7471034798729712756aa38c209912fe1	2026-02-17 16:09:59.632+00	f	2026-01-18 16:09:58.262132+00
af2d2961-58e1-4c8e-a75c-4142f6d7cbfd	637ad6c2-4ebe-4a34-9dee-4069973bf704	dd25e8a9592db366d83b28e115a4e5fe3319b09c6dc26d541ce51c6fb9c4740d	2026-02-17 16:16:03.23+00	f	2026-01-18 16:16:03.467489+00
6656df8b-7ab9-4a43-9f40-0d7daef45ca6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	44c53129fad52f0336a750a41daab058ea74d8323462121eaaaffcef87029d26	2026-02-17 16:20:55.825+00	t	2026-01-18 16:20:56.563644+00
3e651e3e-d7c7-43a4-8623-197c0d01adec	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c5312ccaf91b871b9a85b4966722d26586f90dc82f3934bd4a9babfc66b47e31	2026-02-17 16:27:01.108+00	t	2026-01-18 16:27:01.864104+00
341ce16b-b7a2-4c4b-8038-650a212da308	daa74fd2-afa3-408a-b50b-f1ffa476d608	307ab5a8aa2c7017edbbb89f7d5a564b88a59e4ea5a0586e70f7cb7592a6a3a5	2026-02-21 02:34:53.749+00	f	2026-01-22 02:34:53.777297+00
6c31f14c-a2aa-4fb4-809d-951fbe8ebf2d	637ad6c2-4ebe-4a34-9dee-4069973bf704	ad0179acd03dd3986caf5f9d88415c0adb389147dce9cc97ecbbf4faa7fb0e23	2026-02-17 16:39:25.486+00	f	2026-01-18 16:39:25.717787+00
cf65ec75-22e0-4bd5-8e39-2fd02e7c4501	637ad6c2-4ebe-4a34-9dee-4069973bf704	4e1d8e89f960bfba6756597261a4ba35fbd5cf3ee7104e0f2cb03d8fbc3ace11	2026-03-04 10:18:58.431+00	f	2026-02-02 10:18:58.428856+00
4c9a29b2-dc3f-4bc4-91c4-55fdf139470e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	024ada2d1c57661bb4ac8ca70787d4a3b8de514e5bbb5a90b7a92889d23b768f	2026-02-17 16:34:30.595+00	t	2026-01-18 16:34:31.352834+00
dbdec5bd-4c90-494d-a866-a85a4f1acaac	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4132721fd2c886b6dd6d2cfc45f7f9dec37ea86e945cd8218cf5a873e29cd7bf	2026-02-17 16:42:31.071+00	t	2026-01-18 16:42:31.84648+00
8ab8d9e9-492b-400b-b0b9-b7a156cb53c8	637ad6c2-4ebe-4a34-9dee-4069973bf704	2096714703123d6216bf8607dd9d76df33f49cb907aecd0f3d7613d34a38c4ed	2026-05-29 09:04:39.834+00	f	2026-04-29 09:04:40.520261+00
ac6d8c83-8000-4d74-86e0-d405af413650	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	76b2d4035c604f36f6465038884793e026b495078e2f2cc3f95bec653e22d73a	2026-02-17 16:49:11.237+00	t	2026-01-18 16:49:12.01134+00
7fd0f5fe-3008-401f-b494-959097fbd3d9	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	55a4d7dda5a810b251d3b4802afdd11f557043e9e952e1333b780dcfda31707d	2026-02-17 16:59:31.575+00	t	2026-01-18 16:59:32.351062+00
3da26fe7-0bdf-421b-b95a-ff96e750895d	daa74fd2-afa3-408a-b50b-f1ffa476d608	9d596cf1d2bef93d8a3e5497f449e9c60ed33bb1306f4e37b1bde2492371b25e	2026-02-17 17:22:26.49+00	t	2026-01-18 17:22:26.761614+00
df0dc509-2cd8-4f35-a4f1-b6e524e2804d	daa74fd2-afa3-408a-b50b-f1ffa476d608	def08ba022e97cdf54acd86583385ac429da05166553c39d4b4e64236a56b7fd	2026-02-17 16:14:48.279+00	t	2026-01-18 16:14:48.492205+00
c52db6a3-6664-4c6b-a692-73e32fee1cb7	daa74fd2-afa3-408a-b50b-f1ffa476d608	8c67ef62a9b488fb451baf59eaea95870ff8c739d134ede619ddd5a662e4f00d	2026-02-17 17:06:47.178+00	f	2026-01-18 17:06:47.423428+00
aafb2af1-f371-482f-a65a-f6b798ad5d5a	daa74fd2-afa3-408a-b50b-f1ffa476d608	8c67ef62a9b488fb451baf59eaea95870ff8c739d134ede619ddd5a662e4f00d	2026-02-17 17:06:47.189+00	f	2026-01-18 17:06:47.430101+00
814f3c4d-43c6-4835-b2f2-29027562c38c	637ad6c2-4ebe-4a34-9dee-4069973bf704	fd8d3e247b3a45a537564b44590575bc9c77de566dcfcee1cdfdd2728bba2a25	2026-02-17 17:07:13.313+00	f	2026-01-18 17:07:13.568119+00
53c14cad-5905-4f13-8725-ee9befa694f2	637ad6c2-4ebe-4a34-9dee-4069973bf704	571e97ceb27155676a165a2b5e160c6571cd87ddf9f08c62c15ab0b24c05c97a	2026-05-29 10:09:27.006+00	f	2026-04-29 10:09:27.73256+00
bfff09fd-d1e3-40e8-a13c-233603baa010	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b9d80c5cd938a0d922067449eec20aee8112b6e1bd37d47f8ac0ce81cec9b52a	2026-02-17 17:06:08.827+00	t	2026-01-18 17:06:09.616289+00
2b3c0abf-1ac5-46ac-a5a2-f22fbbce4ade	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1c1093b7d903773088eb22e72cced6cdf0d7294d0f192ad2b51260f00b098961	2026-02-17 17:16:45.714+00	f	2026-01-18 17:16:46.53773+00
1ea9f19b-8214-48e2-8c58-3064d3b0c7ff	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a3622a5fa5ab35b9b061538e6693add1eca78aaf8abeb71f179a1685f3cc44bd	2026-02-17 17:22:07.194+00	f	2026-01-18 17:22:07.987958+00
f4762ba1-6996-4be8-a199-907032a90d7f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	325637241ca906eef78716dc5f0d2ef6bdb9a7572193248a53337af9b566958c	2026-02-17 17:24:29.054+00	f	2026-01-18 17:24:29.848501+00
46514ba4-1f52-4235-8574-cb7eb0949998	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4ffdd8fbe21ca9f8c5e1e0abfb02d16a87d30418ff6c4f113e6df8ac2ca83731	2026-02-17 17:25:16.149+00	f	2026-01-18 17:25:16.946626+00
f9f5153c-9df8-40c7-a211-17a9b11cb721	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a467c78d16f328fa81f9bc9139786d4ea8b6dd1a035063382876edea37b7c221	2026-02-17 17:26:04.732+00	f	2026-01-18 17:26:05.543962+00
2333f555-423e-42b3-acfd-21a0b1a400db	637ad6c2-4ebe-4a34-9dee-4069973bf704	fbb41228bc331793bb28721ab7d7e7671ae45419dcd107c9df191d2156134825	2026-05-29 10:32:05.316+00	f	2026-04-29 10:32:06.052948+00
c885d160-bb91-40ec-8306-e91c9cdcc6b5	637ad6c2-4ebe-4a34-9dee-4069973bf704	38ec8d2a525a2debdbd54ee6270f61af656174e9c461cbe97c16866f74b3e626	2026-05-29 12:30:17.471+00	f	2026-04-29 12:30:17.896545+00
c24170d0-b33b-4366-945b-bc31742dff29	daa74fd2-afa3-408a-b50b-f1ffa476d608	e007ee0d747b6851ee3b97a813319b3d6a1863f335d681765eaf0c900f8b8711	2026-02-17 19:42:30.812+00	t	2026-01-18 19:42:31.128967+00
224ae1c4-5f5c-4ce5-9014-5af8d92d120a	daa74fd2-afa3-408a-b50b-f1ffa476d608	adee27cc219174c3978a0df76b065587aedcffccbe1c4c7b8c2465fd7c99d8de	2026-02-17 17:59:06.598+00	t	2026-01-18 17:59:06.86422+00
e6bfa282-e3f5-4eed-9c9a-6bdae731d213	daa74fd2-afa3-408a-b50b-f1ffa476d608	3740aad3f83e07de37a5f28b715489d09daec25d3e8dd9ef10ea17fbfd8a95ff	2026-02-17 18:13:18.541+00	f	2026-01-18 18:13:18.812473+00
2b47acfd-abd1-4bd3-9f61-cb7da76a7502	637ad6c2-4ebe-4a34-9dee-4069973bf704	7a8b9a854803a2da851437f60c1a0ad57d1aa3753e0f705485c90b8a493f5eac	2026-05-29 13:03:44.064+00	t	2026-04-29 13:03:44.512875+00
bff369be-bcdf-49de-b47b-d7008b8707f9	637ad6c2-4ebe-4a34-9dee-4069973bf704	0c3e56ab17e1f0f4cdcfa80b96763b76e822b8fbde5203814e70d2aaa35c4e34	2026-05-29 13:03:44.71+00	f	2026-04-29 13:03:45.159903+00
40670cdc-dbbc-4dd1-9201-fe9944093783	637ad6c2-4ebe-4a34-9dee-4069973bf704	6525b2d223f61fdc04537e9edc00e4b39ea928635d1dd0cd85a6807f18ac949a	2026-06-03 08:37:31.461+00	f	2026-05-04 08:37:30.046925+00
6dbb9160-295f-4728-8942-c2e0f6d1589e	daa74fd2-afa3-408a-b50b-f1ffa476d608	adee27cc219174c3978a0df76b065587aedcffccbe1c4c7b8c2465fd7c99d8de	2026-02-17 17:59:06.353+00	f	2026-01-18 17:59:06.615562+00
2d1ca4f2-2489-40c8-8752-9c8d1565b2a5	daa74fd2-afa3-408a-b50b-f1ffa476d608	3740aad3f83e07de37a5f28b715489d09daec25d3e8dd9ef10ea17fbfd8a95ff	2026-02-17 18:13:18.542+00	f	2026-01-18 18:13:18.812707+00
808a1dd4-9cbd-4f21-a45d-7371bbd0d24b	daa74fd2-afa3-408a-b50b-f1ffa476d608	421354c76a50bf568b17d22e5153b883ba6ad60f10ebef4271dae6c5f9c7495a	2026-02-17 18:31:02.354+00	t	2026-01-18 18:31:02.645104+00
2dedcac5-3d29-4b81-944c-d89982c5308a	daa74fd2-afa3-408a-b50b-f1ffa476d608	e007ee0d747b6851ee3b97a813319b3d6a1863f335d681765eaf0c900f8b8711	2026-02-17 19:42:30.882+00	f	2026-01-18 19:42:31.207189+00
451bd409-27c3-4d0e-9f4d-801cc08fb8d2	daa74fd2-afa3-408a-b50b-f1ffa476d608	76cf7d61f5b6aabc4e8633b146219e112a3e8d6f467debf4923382403dcbac39	2026-02-17 20:25:36.361+00	t	2026-01-18 20:25:36.493266+00
18b5df0f-bea8-4b4c-86ab-b16ca7779faa	daa74fd2-afa3-408a-b50b-f1ffa476d608	096aa6a88e91e33951fdfda2d10c9676551b6663c638807ca498aa6dc683e963	2026-02-17 20:17:08.977+00	t	2026-01-18 20:17:09.107513+00
cb6bb239-bb40-49bc-ac25-d7464abbe00f	daa74fd2-afa3-408a-b50b-f1ffa476d608	44afa4205b28275454669c5ccd7c4f3c4ee0412f152c22d9aab0b8e1e9b0781f	2026-02-17 20:25:34.597+00	f	2026-01-18 20:25:34.786234+00
cd45d287-f7d5-46cb-811d-fa6ce6f47b5e	daa74fd2-afa3-408a-b50b-f1ffa476d608	096aa6a88e91e33951fdfda2d10c9676551b6663c638807ca498aa6dc683e963	2026-02-17 20:17:08.988+00	t	2026-01-18 20:17:09.117438+00
349da932-5b10-4a3c-a6ac-3356192499e3	daa74fd2-afa3-408a-b50b-f1ffa476d608	9fff4f18da8e79dd9a5e3990093737f104983e9660c518cd70d87efe2991343b	2026-02-17 20:31:24.656+00	t	2026-01-18 20:31:24.795949+00
a8aeb9b7-7999-46a1-abf6-3de7bd64a33a	637ad6c2-4ebe-4a34-9dee-4069973bf704	137383848f8de1e4d384334c6d44814c38a9e4f965485d87795374c6f3ac3d71	2026-02-17 19:44:05.399+00	t	2026-01-18 19:44:05.754529+00
160415ee-341f-4b36-848a-a16eeef27b83	daa74fd2-afa3-408a-b50b-f1ffa476d608	bd675ef5c3d3edd897e728d3b8e4fa80eedd928ccb8fc1a1123222d7db431a5a	2026-02-17 20:40:50.749+00	t	2026-01-18 20:40:49.237532+00
74c3145f-6015-4395-9d0b-5c7b77b75565	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	aa16561e5e22f83a065ea5b949784988940fc157de6bf46ab37959f8d5f5f9bc	2026-02-17 18:52:36.727+00	t	2026-01-18 18:52:37.606272+00
50c179bb-b93c-49c1-ad05-d5d35867c89b	637ad6c2-4ebe-4a34-9dee-4069973bf704	3f0268fde695f5aa7f35dd5ad58a66ce6ef7dee06d1f5fa33ceac315b44f5934	2026-02-17 20:52:03.037+00	t	2026-01-18 20:52:03.232662+00
2ad38f7a-44c8-4f86-9701-eacd65da268d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	141b8a695c5119954c053fd0ea824e5a8c4f10b21ac24969153f21aee5166124	2026-02-17 20:57:44.204+00	f	2026-01-18 20:57:44.362042+00
84df180f-1459-4c5b-beb6-a4c9f082d331	daa74fd2-afa3-408a-b50b-f1ffa476d608	cbfe7555a5b2f998c388d51f0eb0086e6b3bf19a513791d593d6542f1095e172	2026-02-17 20:51:05.314+00	t	2026-01-18 20:51:05.459679+00
189ebd3e-e527-40ce-a07f-17b812c09a8d	637ad6c2-4ebe-4a34-9dee-4069973bf704	115d038185b240433e1104a324b5d0ed5dbd6ccb4950a53caee83196acfa8c7d	2026-02-17 20:52:04.986+00	t	2026-01-18 20:52:05.134907+00
d87092f5-bcb8-4d57-b6bd-f7e7c7f91795	daa74fd2-afa3-408a-b50b-f1ffa476d608	149da0c5f9ae8feb8894bcddba31a0f931dfd0e46c7ea5978f25e1d1484472ac	2026-02-18 00:24:02.24+00	t	2026-01-19 00:24:02.28406+00
3ea54d66-4818-43b5-befe-160c0a1fc66f	daa74fd2-afa3-408a-b50b-f1ffa476d608	13c8cffd0b794461fdda1c5e47520c0617e1902f469cea99d0f10751a8d88135	2026-02-17 21:02:43.35+00	t	2026-01-18 21:02:43.508181+00
70907332-c6e2-4aa8-ab55-df2a01071ca0	daa74fd2-afa3-408a-b50b-f1ffa476d608	91c92340987bab7e6da0a44eab8d9b04265b77a8a26b6b66c1143265913483be	2026-02-17 21:14:47.239+00	f	2026-01-18 21:14:47.400076+00
a96ff1c4-cc4e-42ad-bcfb-2db7a7d2a1ee	daa74fd2-afa3-408a-b50b-f1ffa476d608	91c92340987bab7e6da0a44eab8d9b04265b77a8a26b6b66c1143265913483be	2026-02-17 21:14:47.238+00	t	2026-01-18 21:14:47.400074+00
a4d889e7-de14-40bf-a6a1-93961f5e863c	637ad6c2-4ebe-4a34-9dee-4069973bf704	4c765e2ef540af11568fdd167abfb331e7f64f5ad65a3ffc5390d6dc00a48fda	2026-02-17 21:07:51.683+00	t	2026-01-18 21:07:51.849656+00
14c7f3c8-a70e-432e-89e4-207283d94dd3	637ad6c2-4ebe-4a34-9dee-4069973bf704	6f95447add2e5094fd841de5de2d5e304574495df5c3120b7895a3f7363e7c75	2026-02-17 21:27:17.893+00	t	2026-01-18 21:27:18.051026+00
707590ef-ba27-45c0-a08c-ad38956f94e6	637ad6c2-4ebe-4a34-9dee-4069973bf704	eee1b37f45ed5aed8a9cd5b03cb9949aa4f837b3a0d0ab0cd628b39974ff43bf	2026-02-17 21:27:37.274+00	f	2026-01-18 21:27:37.441936+00
04ae15a6-9b72-47ca-892c-d82925a19c5d	daa74fd2-afa3-408a-b50b-f1ffa476d608	bd240817616cd9b89d2cc3dc1c1386c728c0bdcea158d367b754e3e285b6a5fe	2026-02-17 21:27:45.301+00	f	2026-01-18 21:27:43.75853+00
3c7e4f55-bbb9-4101-97f4-1bfcae3beb18	daa74fd2-afa3-408a-b50b-f1ffa476d608	4073b9cbaaff7d36dfa467060ca38457c8cc7566550ee73456f412016e8b4f63	2026-02-17 21:23:05.937+00	t	2026-01-18 21:23:06.101378+00
318f20c5-6793-40cf-9d15-28ec7807239c	daa74fd2-afa3-408a-b50b-f1ffa476d608	220d045218dfae83ab1df1902a6406c3110a86560766d89c7b68f7055c85ddb0	2026-02-17 21:28:19.852+00	f	2026-01-18 21:28:20.030985+00
5234f8aa-14cf-48aa-a205-7563baffbdb9	daa74fd2-afa3-408a-b50b-f1ffa476d608	220d045218dfae83ab1df1902a6406c3110a86560766d89c7b68f7055c85ddb0	2026-02-17 21:28:19.892+00	f	2026-01-18 21:28:20.078506+00
4aef109c-9f3d-446b-b54e-03a019cbd1c0	637ad6c2-4ebe-4a34-9dee-4069973bf704	0a79a502821ff111155bae13f2639388f5a60d771905f052422f6b9ea9d1c23b	2026-02-17 21:29:27.319+00	f	2026-01-18 21:29:27.492134+00
18745b19-78f7-4ce8-a707-d83bf85cce4a	daa74fd2-afa3-408a-b50b-f1ffa476d608	6d28d3aa5439d7b7fa12ec116c616d2bbdf22f23b1e5dc886966774df3c0a910	2026-02-17 21:39:46.207+00	f	2026-01-18 21:39:46.381684+00
30880340-1d3e-4ace-b03c-5d6e3e79d547	637ad6c2-4ebe-4a34-9dee-4069973bf704	da729a1999043a4e27c725cf7cbaa424b45b2076d575b0c9d07ca555fa2f5b6a	2026-02-17 21:43:42.743+00	f	2026-01-18 21:43:42.921184+00
17823bb0-6d28-4c8a-8e00-321a6b7cd0a3	637ad6c2-4ebe-4a34-9dee-4069973bf704	50705a93a296e160351a450c691e5b3ebe2a62f5a2d6fb6517bc4b6c1555ac08	2026-02-17 21:50:07.63+00	f	2026-01-18 21:50:07.805545+00
56a53c2d-dd9e-4032-b685-e0ffde46a8a5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8574fa8dc5cab9886746e16400b61312c4c3d6d0d45b17b29ff2d52c0d46e7bb	2026-02-17 20:58:43.961+00	t	2026-01-18 20:58:44.10967+00
6fd88470-8710-4128-a8e8-7b0574be5b34	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	30e30a4ac22afd53413fe97e9467c324ceb9d05c5b3e8a7ad61899423e0ccbe3	2026-02-17 22:54:08.829+00	f	2026-01-18 22:54:08.824096+00
59ee7104-8063-4b45-a950-1881f5a887f9	637ad6c2-4ebe-4a34-9dee-4069973bf704	f93209648308730f95ca793672a14a2f5295021029988a2b42745465f5fd38d9	2026-02-17 22:54:24.435+00	f	2026-01-18 22:54:24.433318+00
b6febd2f-5d6b-4fec-b9e5-01e37102ce39	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4fc3994ea04ebd94df3fab3758e34649ed661f1faf22af153458a0b26fde2abe	2026-02-17 23:04:46.503+00	f	2026-01-18 23:04:46.509069+00
c9130086-af72-48a7-8c3a-687027354d7a	637ad6c2-4ebe-4a34-9dee-4069973bf704	ecc1bc24dd103abdb84fa8b68482cb1f9a1bd7e80f9a825775ac4388dd0dbcdd	2026-02-21 02:35:23.861+00	f	2026-01-22 02:35:23.887609+00
7272f029-95e6-4df1-a711-7775966ccf96	637ad6c2-4ebe-4a34-9dee-4069973bf704	db1e08c5cb4d22e6f5c5b579493ea22780e55220c387d57863a8dd0d99af1e69	2026-02-17 23:39:20.195+00	f	2026-01-18 23:39:20.223018+00
2b2be392-57d4-4b48-a3f4-b5cd02f7455e	daa74fd2-afa3-408a-b50b-f1ffa476d608	0f6d899c89c9594d45df2dbfa0239c3df0699ea0a0caec7dd44240aaf43d6ee6	2026-02-17 23:44:17.028+00	t	2026-01-18 23:44:17.044541+00
ba7fea17-6e90-4aa5-8c0d-9f3f6294f8dd	daa74fd2-afa3-408a-b50b-f1ffa476d608	7fc28b0ce5cf7778457f136275bbff1c3dc30e73104a126f3756e3f818266fe1	2026-02-18 00:20:54.117+00	f	2026-01-19 00:20:54.160062+00
af9133af-5fdf-4351-8d35-3155304d94e8	daa74fd2-afa3-408a-b50b-f1ffa476d608	1f74c7110ce10362602882782ece71c2df162fb6a1b23e8fc66e59d7228185cb	2026-02-18 00:21:09.323+00	f	2026-01-19 00:21:09.370433+00
55203344-973e-4389-9d13-ba6a93ac4d1b	637ad6c2-4ebe-4a34-9dee-4069973bf704	df09b5cb6ced8091cfde6c812bb3be05e5963ce79dbd84cb3cd28237fcf79219	2026-02-17 23:53:06.737+00	t	2026-01-18 23:53:06.768628+00
e9f23e27-b811-47c1-a452-26deb9cfee91	daa74fd2-afa3-408a-b50b-f1ffa476d608	087916cc528b3508babf8f11ed3b24ba3816eda57d185400f0e5edcff5493c9e	2026-02-17 22:59:48.75+00	t	2026-01-18 22:59:48.742535+00
01615cb1-b887-4467-84f9-dfc9fe02e712	daa74fd2-afa3-408a-b50b-f1ffa476d608	149da0c5f9ae8feb8894bcddba31a0f931dfd0e46c7ea5978f25e1d1484472ac	2026-02-18 00:24:02.356+00	f	2026-01-19 00:24:02.405482+00
6845ae3f-6bf3-4e87-9e2f-363656a687da	19fb8f43-fa15-4f8b-ba45-1fb54e8ca426	e8f8c15ae13003d339dcf4d77088d40c4db955229acee330a792ca2866ea39b1	2026-02-21 02:35:33.661+00	f	2026-01-22 02:35:33.687542+00
91cd1af4-e358-47f7-a6b2-767ac1c038aa	daa74fd2-afa3-408a-b50b-f1ffa476d608	6f99d79374a7e34b3b04fb1cd573829918499be0d592ab0f9c79dbbb6f26d1de	2026-02-18 00:30:55.925+00	t	2026-01-19 00:30:55.980025+00
64078206-5c18-44d5-a6ea-cbbdbd1d5224	daa74fd2-afa3-408a-b50b-f1ffa476d608	52c39f9495c8a941be519839f79fd6a1c4615610fcb2d96fca7ab4185e73d991	2026-02-18 00:38:03.597+00	t	2026-01-19 00:38:03.6613+00
d2c32823-62a0-4ced-ae67-87dcd6d1eff5	daa74fd2-afa3-408a-b50b-f1ffa476d608	d4c2e76be0b3cb61cbf371939643be30f70ff068f1cca3704d2fddfa351d8213	2026-02-18 00:44:23.103+00	t	2026-01-19 00:44:23.171543+00
9ae01065-0cef-490e-81cb-4be58ba4a619	daa74fd2-afa3-408a-b50b-f1ffa476d608	86518c7b52ae89badf953b30108265d385149fbeaca85d085abfbf3105b001ae	2026-02-18 00:52:36.315+00	f	2026-01-19 00:52:36.3827+00
94447891-4257-4f07-a982-400408d271aa	daa74fd2-afa3-408a-b50b-f1ffa476d608	ad393c344321539ea8aa598e28d6cafbd9970c02f758dd39a86cd96ccc229848	2026-02-18 03:06:31.426+00	t	2026-01-19 03:06:31.566144+00
657fa74f-c734-4e31-8adc-cd7cc5ff9d96	daa74fd2-afa3-408a-b50b-f1ffa476d608	4304cb6572d82fb9b084269aa067a273ebf138594fe6022b2c8c96a96a6e30e9	2026-02-18 00:52:56.886+00	t	2026-01-19 00:52:56.962388+00
89d02844-590b-42b7-b71e-12d2f55fe1d9	daa74fd2-afa3-408a-b50b-f1ffa476d608	9207895de3b5183ac061d774a7ae195cab9a80b30cb94a734c6e08dc179afbb2	2026-02-18 03:11:38.854+00	f	2026-01-19 03:11:38.992797+00
cca6bbc4-d354-46dc-b758-fda20b0702ba	daa74fd2-afa3-408a-b50b-f1ffa476d608	ad393c344321539ea8aa598e28d6cafbd9970c02f758dd39a86cd96ccc229848	2026-02-18 03:06:31.43+00	t	2026-01-19 03:06:31.568995+00
7e34613f-e265-4f9a-87f3-e0c03e1caf03	637ad6c2-4ebe-4a34-9dee-4069973bf704	f2dcf7c8d30166d42fea2f9c96cca94f69d1e847002ef1dd95614e54458cf8d9	2026-02-18 00:37:40.654+00	t	2026-01-19 00:37:40.710844+00
ae11bb2b-7986-4a6c-b4e3-d28c29c2a411	daa74fd2-afa3-408a-b50b-f1ffa476d608	52c361d4d698eca3151209a1ae2ee1ac748faaecfa41a98bd360d1164eac4bfe	2026-02-18 03:11:39.99+00	t	2026-01-19 03:11:40.134989+00
927c2bbf-961b-4285-9e90-c834335ff8d1	daa74fd2-afa3-408a-b50b-f1ffa476d608	df1b85f76ed418166d0e6a225822d0771fa03de2807a3062223f4b923103e519	2026-02-18 03:31:07.336+00	f	2026-01-19 03:31:07.502391+00
f88741e5-2f27-47e0-a25d-cf09c89e0cfc	daa74fd2-afa3-408a-b50b-f1ffa476d608	df1b85f76ed418166d0e6a225822d0771fa03de2807a3062223f4b923103e519	2026-02-18 03:31:07.312+00	t	2026-01-19 03:31:07.473995+00
6f86b1b0-97b5-485a-bf44-7837569c70bf	637ad6c2-4ebe-4a34-9dee-4069973bf704	5a1da9276dd9e629bbb13484e4a22b899d0f53591e433af7849086064a8e27cb	2026-03-04 10:19:17.757+00	f	2026-02-02 10:19:17.748237+00
67ebd4be-5546-43c5-b21d-ca6423ca050c	daa74fd2-afa3-408a-b50b-f1ffa476d608	bd2fad6ecb90f6b6f5fbb5639b80a4a931476bafdd36d61da461f6559984e300	2026-02-17 20:44:19.852+00	t	2026-01-18 20:44:18.340115+00
2ae2aef1-ee9c-46bd-82e6-1d674fb9c508	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e34374c0b1831ad1754926f8d5b85d1ada56925587301bcb232c06716396c4ec	2026-02-18 11:30:10.455+00	t	2026-01-19 11:30:10.854977+00
127a2cb7-8a1f-43c4-ac97-89b702c78162	daa74fd2-afa3-408a-b50b-f1ffa476d608	f61f2e42d574923ded2d6bc85696bbdfb4a47f0f7d61c650f9fdd7cbe8679931	2026-02-18 11:24:51.25+00	t	2026-01-19 11:24:51.650288+00
5c3cbb51-56b9-401b-a9d7-4d4650081c7b	637ad6c2-4ebe-4a34-9dee-4069973bf704	7061adde37caee2c9b3338be45ccfe7b5fb783a84cd1145cb0546a4972a6b1da	2026-02-18 11:24:36.821+00	t	2026-01-19 11:24:37.214023+00
be7abbb2-f92a-4fca-8b8d-6634cfa870ec	637ad6c2-4ebe-4a34-9dee-4069973bf704	276807683b7dd8f699ec6e5017067ea496a212dc5114a49c08da7ecda1e464a4	2026-05-29 09:05:06.195+00	f	2026-04-29 09:05:06.884607+00
14d7856a-6f96-42cd-b0db-7284adaebe9d	daa74fd2-afa3-408a-b50b-f1ffa476d608	781d80aff017b56b79fbe4381aa1ae7a0faa1763abba7bf0403125492f03354d	2026-02-17 21:24:14.414+00	t	2026-01-18 21:24:12.854578+00
8c94ca3a-017d-47b3-ab56-87d00e612bb0	daa74fd2-afa3-408a-b50b-f1ffa476d608	5f85f33f70cbf55bb595ae6a86f114d8ca5963d757a80e647a2f9124258319e9	2026-02-18 11:33:24.763+00	f	2026-01-19 11:33:25.163824+00
239ae191-fa42-4bcc-b51e-adf88e921de5	daa74fd2-afa3-408a-b50b-f1ffa476d608	11238a5ef0bf36b84d450d2a3c2e4df67c05afe483c04e3ea5245d2030805da0	2026-02-18 11:30:41.159+00	t	2026-01-19 11:30:42.958931+00
9f3806e9-25aa-41ac-aa41-a4ecdcfa1854	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	f8935e2619fd86672b38339022b030d2518b7be057a302070815d8d358f303d0	2026-02-18 12:25:53.571+00	t	2026-01-19 12:25:53.993041+00
9d8de10e-a979-47d1-b1f6-da5e37fc614f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0149d1a9b4415985e3cd102d05f190f3126867223f6ec34889da4edb22ab6445	2026-02-18 12:30:59.491+00	t	2026-01-19 12:30:59.918565+00
22c617f6-5b10-46bf-8fc9-7b9d2c50d0c4	daa74fd2-afa3-408a-b50b-f1ffa476d608	59747a43d5b24e799250a4d2b2c1ef3c6751074e5f67d7d51b8860fdf8b99e31	2026-02-18 11:36:17.232+00	t	2026-01-19 11:36:19.028528+00
1e5ead0d-1988-4b19-b6ef-35d2a88ee7ae	daa74fd2-afa3-408a-b50b-f1ffa476d608	8a410324d6473ed8cabef7e9084a9542481da8178d6d79e52a23256d1f89e7d9	2026-02-18 12:42:06.307+00	t	2026-01-19 12:42:08.05794+00
7a52de5f-33ac-4c69-aadb-ca13c146233e	daa74fd2-afa3-408a-b50b-f1ffa476d608	907e5fdc9673410ce2485b8f2c5c994a7cd73c8a2c376b48669a32703cc0c1bf	2026-02-18 12:49:55.145+00	f	2026-01-19 12:49:56.892789+00
0c1623aa-d654-4dd5-a9f3-de0e80fb8171	daa74fd2-afa3-408a-b50b-f1ffa476d608	7b9189c7a4e16a2803e8ea8996acc66e6871338dcb74906e676aa98a0311eaf4	2026-02-18 12:50:50.25+00	t	2026-01-19 12:50:52.002221+00
2e463aa9-07d2-4b9a-8163-21627052cce4	daa74fd2-afa3-408a-b50b-f1ffa476d608	49a7feb98443f6bb77bbb8752d8a1b9606c32651642330456316df1287cb6afa	2026-02-18 12:52:22.61+00	f	2026-01-19 12:52:24.380241+00
c4f03ea3-4f94-4a3a-9038-ac0dac49e6ca	daa74fd2-afa3-408a-b50b-f1ffa476d608	5b59ddc0cbf1aee1077b3120d57cd4d3e9059827c836383791d4b0b1e0b2da2e	2026-02-21 03:00:53.064+00	f	2026-01-22 03:00:53.088685+00
6607a84f-4776-4363-a8ef-1882208316e7	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	73e28c6f2a045d60df786be8ba340948cb4069a62c0a17cddf8d79229bc73d83	2026-02-18 12:38:07.709+00	t	2026-01-19 12:38:08.139083+00
a87ba89e-ced4-4251-8f36-6454ff2683e0	637ad6c2-4ebe-4a34-9dee-4069973bf704	71dfccde61dbd550608ea92bb29b9d75aebdf1eda95033101312513a03a066f2	2026-03-04 10:20:20.252+00	f	2026-02-02 10:20:20.249683+00
e7ec3db6-55c4-48f4-966c-d05e7cccd8e8	19fb8f43-fa15-4f8b-ba45-1fb54e8ca426	a5597692fc331a0acc782f7a3dac8e778763ee19d0fe5ca39ca6d30e210ec154	2026-05-06 06:11:12.488+00	f	2026-04-06 06:11:11.800654+00
74d0ba36-2ebc-4bc0-b8b0-edbcf5e5aea9	637ad6c2-4ebe-4a34-9dee-4069973bf704	4612f75a1d5d25be845f579aaca3ce85f81a2510ce550369f51fd6106e698cb9	2026-02-18 12:59:31.4+00	f	2026-01-19 12:59:31.844865+00
2c2adbe7-0813-49c6-bffd-72c037a84a2b	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ac5e1ea4c13d89dbc0b77949b3f053c2bc55f87fe95621dcf836c731316ace79	2026-02-18 12:54:48.517+00	t	2026-01-19 12:54:48.963416+00
f78aecf6-71b8-4c6e-95bc-12e07fbe890a	daa74fd2-afa3-408a-b50b-f1ffa476d608	5f85f33f70cbf55bb595ae6a86f114d8ca5963d757a80e647a2f9124258319e9	2026-02-18 11:33:24.745+00	t	2026-01-19 11:33:25.14618+00
43745a9f-dcca-4d8f-9980-b634743f077f	637ad6c2-4ebe-4a34-9dee-4069973bf704	22f0650bdc3a9fc7f55758a5dfffb09af3715d72d1ab6fb6cba7988ff2896a5f	2026-05-29 09:11:42.316+00	f	2026-04-29 09:11:43.005857+00
404d54c3-48a8-4971-99f3-bb3a86b6ff2d	637ad6c2-4ebe-4a34-9dee-4069973bf704	f119d0c17b7a64064a4d14994c8e6459904fe0aa3366e02ed71c58108b799142	2026-05-29 10:09:56.382+00	f	2026-04-29 10:09:57.106556+00
a5209f53-9c2a-4c4b-a204-0aec63338678	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c8564890cefa126e5b24f4cfc169e127245fb19a4c203d4222573998c040095e	2026-02-18 13:00:05.359+00	t	2026-01-19 13:00:05.806044+00
8e57faf2-fa14-4a1f-9a38-bebe983d1971	637ad6c2-4ebe-4a34-9dee-4069973bf704	39fc8770f29f48f25d320c1e60a9f24dd122e270c7b924be5ab3390d5397119a	2026-05-29 10:33:04.033+00	f	2026-04-29 10:33:04.771099+00
2ff1df5a-7e4b-4ede-89e9-ac93c3011a41	637ad6c2-4ebe-4a34-9dee-4069973bf704	0e130b2de293460917eeb453a9e1dcfb04a25ae35e961e05c6ea9055bff23485	2026-05-29 12:30:50.201+00	f	2026-04-29 12:30:50.632553+00
d5e40687-d95f-40c0-acdd-5e740c1ea1d8	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a0b48fd40477ceaaa05d085cb1bd731858c80abb2b6cb081644dc926f4e64650	2026-02-18 13:06:01.632+00	t	2026-01-19 13:06:02.107652+00
fa53385c-0b70-4e29-bef1-dba984dfdbcc	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	129c9f5477fb6b2f615aabf53ff03785e6cdf46f4106fa291b8eb362b9c1c655	2026-02-18 13:12:09.181+00	t	2026-01-19 13:12:09.629935+00
e53f7141-b894-4b51-b0a9-51553092de7a	637ad6c2-4ebe-4a34-9dee-4069973bf704	cae33b79b7cfc8a28c63d378b92283f2456984bc99ee01c759c5df0082023c8d	2026-05-29 13:04:30.282+00	t	2026-04-29 13:04:30.730491+00
8c1a6399-d152-40a8-a210-18c3c203e40a	637ad6c2-4ebe-4a34-9dee-4069973bf704	1eee08a7c0320974a26a898f85292704d231ef7a4e85a58929853f4c1fad2ff0	2026-05-29 13:04:30.862+00	t	2026-04-29 13:04:31.310404+00
d73aca3b-598b-4464-a51e-dbb99c137a32	637ad6c2-4ebe-4a34-9dee-4069973bf704	31584441ab7b76d81cf1516d0b22b33d3e5e57ec1202bd459c1bd90e3c7977a5	2026-06-03 08:45:08.896+00	f	2026-05-04 08:45:07.487033+00
5d036dfd-ef3c-4c33-ad17-e22f7642678e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4031bc1dddb7f17cb0677de77163f0be0908c9f0a60a62551cc95e57d9961d70	2026-02-18 13:18:26.185+00	t	2026-01-19 13:18:26.640685+00
5ac80e69-c498-4ce5-ae0b-ba33334cb4a0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	649c4317b003f9ca4b7c91f456a2a24e2df64e5526493ef41a1ee6946c79ed34	2026-02-18 13:23:59.328+00	t	2026-01-19 13:23:59.797311+00
bc67578b-b707-42a7-9746-50dcff9f6ab9	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e7847a9d8e0f66d159b07332bee1ece35e0fc8497a54986803a359cd6bd14a4a	2026-02-18 13:29:10.751+00	t	2026-01-19 13:29:11.217753+00
c6714440-174c-48ab-9f73-bf6aa48dbba2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8a58849d5da6dddfa891927071f9b37c44dc868895610da58048c31869f79ac9	2026-02-18 13:37:45.406+00	t	2026-01-19 13:37:45.883932+00
8f190a0c-b32f-4dc4-af5a-a6790b38044f	daa74fd2-afa3-408a-b50b-f1ffa476d608	59e088365c3acb7abbac9aa46216bc8b453c756078ba628489d01ebb6d52f08b	2026-02-18 13:00:30.932+00	t	2026-01-19 13:00:31.400183+00
1a85e7f4-dceb-4701-a832-3c7c8503300e	daa74fd2-afa3-408a-b50b-f1ffa476d608	61f1c3125bc5695964bcc68b9b136c330eab5ec7c44e109b71ae6af7b4bc1b47	2026-02-18 13:43:56.743+00	f	2026-01-19 13:43:57.203695+00
80a9a84f-010e-4b88-b3a7-299aeadb09ee	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	85a778cdd7ff16ce4d5429c16c8f896545237d216825f4d16bfd2bdbed8bb8a5	2026-02-18 13:43:56.226+00	t	2026-01-19 13:43:56.701379+00
4f1902d7-7cd6-4342-bed6-4a6d12b71bf2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2733915f0384b3ff5b6cdfef2a228ed799edf8b6979898020ab9ae1661a47ebf	2026-02-18 13:50:53.328+00	t	2026-01-19 13:50:53.789818+00
3a0b885a-0f5c-4c21-b7f9-2b535be7d453	daa74fd2-afa3-408a-b50b-f1ffa476d608	61f1c3125bc5695964bcc68b9b136c330eab5ec7c44e109b71ae6af7b4bc1b47	2026-02-18 13:43:56.694+00	t	2026-01-19 13:43:57.155148+00
488ccf7d-78bd-459b-a62b-205ad43f297a	690537e3-a003-42c1-8c89-056489c47563	2c27d8096a1660b4c4cfd663c80a67a963ca250c4c92da7d1eea271e34f2b350	2026-02-21 03:54:21.281+00	f	2026-01-22 03:54:21.306498+00
7fa741e6-9ad3-4689-8c8e-96ace9fd6df3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0935f5e23b01b9bd90f1bfb3dde7f49c4692df33035987f24566c0cb2671f028	2026-05-27 15:45:33.894+00	t	2026-04-27 15:45:34.474254+00
818fd3d2-ed99-43f4-ab0d-cd7e0d008ba5	637ad6c2-4ebe-4a34-9dee-4069973bf704	7be9260a7d31d2326577c02b9199f788f6e480291ea8addd345dc5c6068b04cc	2026-05-29 09:12:49.003+00	f	2026-04-29 09:12:49.693704+00
e0baa6e7-109c-4143-b4a4-cbca46cd25cc	daa74fd2-afa3-408a-b50b-f1ffa476d608	35e08904c12e48a4fc4f1b0b77f63dde1d2d080e1ae1a83961d8c229bd45d612	2026-02-18 14:39:38.758+00	t	2026-01-19 14:39:39.252463+00
07f3c671-5e94-4d2e-93d8-7e7c1cb71490	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	aec2c7cbaac32d37bf362c8c934cb7fa65d1a7067913f9ccd8890bb048ee2685	2026-02-18 13:57:34.507+00	t	2026-01-19 13:57:35.000127+00
2df6b24c-af85-4623-8542-d427ead5d346	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	991bd4f77607eb21be7c87796a393361257b64a32d825661c8cf375c8a1265c7	2026-02-18 14:02:59.667+00	f	2026-01-19 14:03:00.132392+00
e7fbd856-e3cc-4941-bff9-5d20d47ea3c1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	991bd4f77607eb21be7c87796a393361257b64a32d825661c8cf375c8a1265c7	2026-02-18 14:02:59.695+00	f	2026-01-19 14:03:00.185893+00
d0509ede-8d51-4237-a3e1-1e83be229b38	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	cb6805778e95ad1b21c6b60d2968554bdb7ff56b15435b7493d9f5377e05b042	2026-02-18 14:27:37.146+00	t	2026-01-19 14:27:37.635531+00
5a2bd702-ec79-4cc6-8468-6efafc2a5d13	637ad6c2-4ebe-4a34-9dee-4069973bf704	3a3612306dcbf48a90af537f5e2887a3591c15778f393f7497c120d1595c0219	2026-05-29 10:10:49.496+00	f	2026-04-29 10:10:50.224404+00
2dab41a3-84f4-4cfb-8902-8df2e65b15fc	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	30c4e9902b90f2c98b335696aaf4b0a57aa48e20f992dd0e45045bcd0f4357e1	2026-05-29 10:37:13.738+00	t	2026-04-29 10:37:14.479476+00
7251ed6d-6f5b-4131-9a36-a61a3bc59a1d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	991bd4f77607eb21be7c87796a393361257b64a32d825661c8cf375c8a1265c7	2026-02-18 14:02:59.549+00	t	2026-01-19 14:03:00.017052+00
1b583ad0-53ba-44df-a08f-4a4cdac848d2	637ad6c2-4ebe-4a34-9dee-4069973bf704	9ebd5c4c0ba442c7dd0598b545cd02e28e68273de02eb4fcfeb4379709cceca1	2026-05-29 12:32:17.031+00	f	2026-04-29 12:32:17.457074+00
14c07491-5d7d-4a82-9262-bcc2522e5276	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ffa1ed169ce7729f3ab78dda053d234c35ffcb0bcea6bcf59782478bb205b240	2026-02-18 14:10:58.963+00	t	2026-01-19 14:10:59.450425+00
21522469-1a5a-4e04-9bd5-0416fc885b6e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1a339dcdd628ac4cedf950038fb209a8a2cc159f66fc6d07cc763582356f6900	2026-05-29 14:51:32.872+00	f	2026-04-29 14:51:33.251283+00
79c186ec-97dd-492e-a923-05919ae1bc22	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	37db7842c8c7868387d869b0ea7eaa6fb8433a02c8024d2a4b50acdc8e51e5f3	2026-02-18 14:16:11.74+00	t	2026-01-19 14:16:12.212216+00
a0ce2c2b-7d87-4711-ad8a-66f9f07e026c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1427ba7c3bf8c844cd80b85f1950db1b24f60f48c9da1207bcb48df8654c62c9	2026-02-18 14:24:25.701+00	f	2026-01-19 14:24:25.798434+00
b1b7c6b6-2a9a-4aed-be35-089f6effc93f	daa74fd2-afa3-408a-b50b-f1ffa476d608	207125dd061426d31624d7af0599001755768507a51b464b3ea9149674e3e06b	2026-02-18 14:21:28.313+00	t	2026-01-19 14:21:28.806487+00
9517ce4c-202c-440a-a3d5-67bffa14a03e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	71a1d8fed1447915c7731382b3912c94968e76f15cfee5302a94094304964ec1	2026-02-18 14:21:18.241+00	t	2026-01-19 14:21:18.733585+00
5a4c68f4-384e-4f5b-bdba-713c9d81d19d	daa74fd2-afa3-408a-b50b-f1ffa476d608	9090cd1bc9d31f88504474dec5f43ae85587f7f340a8ac8429e9baa836fcf64c	2026-02-18 14:26:45.448+00	t	2026-01-19 14:26:45.943667+00
32adc253-0a56-413f-acd7-816a6ca11d0a	daa74fd2-afa3-408a-b50b-f1ffa476d608	605de2707e443626986a04218e81e8c35b63f320d17a11ed2c474c35ee891633	2026-02-18 14:34:31.491+00	t	2026-01-19 14:34:31.986795+00
78aea14f-2018-429e-87ed-abbc6eecb626	daa74fd2-afa3-408a-b50b-f1ffa476d608	25e21d266039098ec962aa1b8ba5752c2bb2dd84be84613a1442afc1b3b9d4f8	2026-02-18 14:56:50.711+00	f	2026-01-19 14:56:52.38782+00
f1fefb9c-4816-4dcd-8a47-18a89ba70e69	daa74fd2-afa3-408a-b50b-f1ffa476d608	25e21d266039098ec962aa1b8ba5752c2bb2dd84be84613a1442afc1b3b9d4f8	2026-02-18 14:56:50.851+00	f	2026-01-19 14:56:52.543727+00
cb7e09f8-7031-4536-8fff-e133bc699341	637ad6c2-4ebe-4a34-9dee-4069973bf704	42f15fc8338ae5938ce78e3a773987b321f28b0148bb783742cf125388713479	2026-02-18 14:58:34.201+00	f	2026-01-19 14:58:34.707127+00
31141134-1400-4a51-a29e-d614035d666d	daa74fd2-afa3-408a-b50b-f1ffa476d608	6a3291c82335489a3e95d00dc1084308cbfde81a61c98daf4d698b0aa25085b8	2026-02-18 14:53:10.851+00	t	2026-01-19 14:53:11.366795+00
df1a80b9-2c08-4d8c-b954-64ae1691e33c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ddf3ed30c7db9d15a35393395d9e6cff2a1c5619d6cf7c23cf5d58024cf9652d	2026-02-18 14:53:40.033+00	t	2026-01-19 14:53:40.523217+00
2823a9f4-bd5f-433b-b8e1-8b784723bc0d	daa74fd2-afa3-408a-b50b-f1ffa476d608	f9b00865bce790b325fa8486db8a10935ab8ce9a5cb1ae195477b7137adb5e6e	2026-02-18 14:58:41.567+00	t	2026-01-19 14:58:42.055543+00
a8b19ce3-0d0e-4524-b79c-df78d77a70a3	daa74fd2-afa3-408a-b50b-f1ffa476d608	4a1bd80dbf7396a55bdf1caa15cae0711b9e10dfc1ded93ae8ad4c8fc2b8e618	2026-02-18 15:04:02.939+00	f	2026-01-19 15:04:03.451781+00
cc1d7213-e812-40b2-bf8b-3839ff46f599	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	85a56b5bcea1eb7524809c08caf7b2971e58014a800de22d443de72531b13408	2026-02-18 14:59:08.634+00	t	2026-01-19 14:59:09.140799+00
d608038d-3e9d-44ff-8473-4908d523cc85	637ad6c2-4ebe-4a34-9dee-4069973bf704	9494b3d1c296ff9816395dfda52502f55e1d7060c5f7b25819e6a219dc0be8fc	2026-02-18 15:04:27.291+00	f	2026-01-19 15:04:27.800447+00
25fe874a-be49-4f36-b3cc-c0f479998192	637ad6c2-4ebe-4a34-9dee-4069973bf704	af9d1d1b72dd044927d7af0ddf26129172dad6b4412de37036d983deeef5f34d	2026-02-18 15:08:01.838+00	f	2026-01-19 15:08:02.3666+00
71bec872-89ac-4aa4-8242-49d31ee6631e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0ff276562442b8c13a57ff5c21d266b004978dedc0f0429528321840f1dfe6a9	2026-02-18 14:34:45.099+00	t	2026-01-19 14:34:45.206148+00
2334e57b-8d34-40c2-b28a-b2f6bec27c4a	daa74fd2-afa3-408a-b50b-f1ffa476d608	4a1bd80dbf7396a55bdf1caa15cae0711b9e10dfc1ded93ae8ad4c8fc2b8e618	2026-02-18 15:04:02.785+00	t	2026-01-19 15:04:03.29533+00
978eb6d8-7d64-4033-a427-249f7e4eeaa3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b0e06b6eeec89431a5d9f71bbef786a07206d9453403fa219ad5d48029126316	2026-02-18 15:04:19.433+00	t	2026-01-19 15:04:19.95323+00
d5b91602-37a3-4d8f-a10c-2c37cadc506a	daa74fd2-afa3-408a-b50b-f1ffa476d608	5d492e8cff938ccaf9684092dfe4d0dd0a706f06751983f5b8834068f24db556	2026-02-18 15:09:17.1+00	t	2026-01-19 15:09:17.594336+00
6ce622d5-e6af-4458-92de-30039d9939f9	daa74fd2-afa3-408a-b50b-f1ffa476d608	5d492e8cff938ccaf9684092dfe4d0dd0a706f06751983f5b8834068f24db556	2026-02-18 15:09:17.13+00	f	2026-01-19 15:09:17.624334+00
47e518f6-7383-44e3-a977-89ef3749efee	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	51dabac64fed59d43eec39d9b2c90831df0b8a57d327ae15778d3c0d3fff0eee	2026-02-18 15:09:34.47+00	f	2026-01-19 15:09:34.616597+00
4aeaed06-efd6-44a7-9ce9-eddc65ea0bc6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	51dabac64fed59d43eec39d9b2c90831df0b8a57d327ae15778d3c0d3fff0eee	2026-02-18 15:09:34.505+00	f	2026-01-19 15:09:34.653668+00
95af66eb-1e3e-4ac4-8133-8cdd1cb96eb2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	51dabac64fed59d43eec39d9b2c90831df0b8a57d327ae15778d3c0d3fff0eee	2026-02-18 15:09:34.545+00	f	2026-01-19 15:09:34.695537+00
c320abcb-1094-4936-9513-4199bc4f0c22	daa74fd2-afa3-408a-b50b-f1ffa476d608	88c41b1f91513af97963a9d2426c893934a3c3b8f721ca30d861d2dac562f9ac	2026-02-21 03:55:11.145+00	f	2026-01-22 03:55:11.168677+00
4564ff7f-9705-4af7-b647-f68c8613017e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6013aac5b04454d5df15011351cffc6e53daf112583346131b4778334cc6228f	2026-02-18 15:30:18.22+00	t	2026-01-19 15:30:18.377001+00
e4dfe667-8741-42db-b2a6-acbad910d2a2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fdd4d5505f87d8464b381a4ba07ab839c479bfa5df2ad7716701caaca319092e	2026-02-18 15:14:50.859+00	f	2026-01-19 15:14:50.993652+00
28a20abb-d421-4321-a621-a64516cf5e80	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fdd4d5505f87d8464b381a4ba07ab839c479bfa5df2ad7716701caaca319092e	2026-02-18 15:14:50.91+00	f	2026-01-19 15:14:51.049388+00
850d8e2e-369b-47ca-b303-44f3ff512249	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	51dabac64fed59d43eec39d9b2c90831df0b8a57d327ae15778d3c0d3fff0eee	2026-02-18 15:09:34.355+00	t	2026-01-19 15:09:34.487939+00
3c08626e-9cb0-4e65-85cf-777a1d27fed3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	51dabac64fed59d43eec39d9b2c90831df0b8a57d327ae15778d3c0d3fff0eee	2026-02-18 15:09:34.471+00	t	2026-01-19 15:09:34.604168+00
1c956952-b80b-40c1-a690-a20cca8c9c58	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	002c912b5095dc2c43affe4d34faa18179ca29379d13ca54df5eebf9bf233dde	2026-02-18 15:14:51.089+00	f	2026-01-19 15:14:51.255839+00
6c189c5f-d3b6-41d1-b0c3-f4d0fb92230f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	002c912b5095dc2c43affe4d34faa18179ca29379d13ca54df5eebf9bf233dde	2026-02-18 15:14:51.186+00	f	2026-01-19 15:14:51.34142+00
e98a5848-0324-4e39-9ecf-5f9fdf2e00fb	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c1d4bc071712baf3397fd6f6f1f866f1e97886b556954337c1b200997068b430	2026-02-18 15:39:53.802+00	f	2026-01-19 15:39:53.968518+00
b61fd734-e6f8-41d9-9798-84af9d12898d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c1d4bc071712baf3397fd6f6f1f866f1e97886b556954337c1b200997068b430	2026-02-18 15:39:53.803+00	f	2026-01-19 15:39:53.969831+00
9d0cacbb-85bd-4dec-9bc3-ab76c2d66ba2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	66782649d6ce52b717e7b35d88d5ac343d71a18c3d8dcaa29465b6ddc7ad7a88	2026-02-18 15:25:11.554+00	t	2026-01-19 15:25:11.707405+00
d82965ac-f5c2-4d83-853a-432d58309bb6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	002c912b5095dc2c43affe4d34faa18179ca29379d13ca54df5eebf9bf233dde	2026-02-18 15:14:51.036+00	t	2026-01-19 15:14:51.186613+00
60c9406f-b75f-4f15-8a91-68b8872c9e90	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fbf7f63aea3319e8b75a145a547f8b2ab0880a602e4f2b3c7a8f7c8e0ebf463c	2026-02-18 15:19:59+00	f	2026-01-19 15:19:59.148195+00
47039f87-7471-48ff-8e25-ceac3c0ad864	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2378852981b4eee163519ab56c4ac12779226107ca53745ff92f02e18b3e4ca8	2026-02-18 15:19:58.999+00	f	2026-01-19 15:19:59.162408+00
96f54663-bf14-4016-931e-aaa9c66c44f3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fbf7f63aea3319e8b75a145a547f8b2ab0880a602e4f2b3c7a8f7c8e0ebf463c	2026-02-18 15:19:59.033+00	f	2026-01-19 15:19:59.191426+00
cc4cde06-0f00-418a-a045-36bb09cf75e4	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fbf7f63aea3319e8b75a145a547f8b2ab0880a602e4f2b3c7a8f7c8e0ebf463c	2026-02-18 15:19:59.032+00	f	2026-01-19 15:19:59.193181+00
f6b87643-5e78-443f-a3de-1989f2e9d065	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	7586fdd555093271592e1693d72a4b1ee542891749e37551377a71e5817eea2e	2026-02-18 15:13:50.528+00	t	2026-01-19 15:13:51.023999+00
6e4b8123-14da-4c47-9f11-7bd9c37232a9	daa74fd2-afa3-408a-b50b-f1ffa476d608	edc181432bbcffaf967cafac63d1265461d4478aa722d62092d3c9bf59225dcf	2026-02-18 15:21:56.842+00	f	2026-01-19 15:21:57.362226+00
af493479-d03c-4fed-9fc8-fad8324ddb31	daa74fd2-afa3-408a-b50b-f1ffa476d608	ed2248477f40094770864bb7257e31fe7f4337439cceecd1bb2bc734540d4c1c	2026-02-18 15:14:27.244+00	t	2026-01-19 15:14:27.74768+00
f6dcf9e4-dcfe-4ccd-b019-041b994a55a0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6013aac5b04454d5df15011351cffc6e53daf112583346131b4778334cc6228f	2026-02-18 15:30:18.309+00	f	2026-01-19 15:30:18.479408+00
f889e9bf-6c3a-4b0b-8620-2a967618389e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6013aac5b04454d5df15011351cffc6e53daf112583346131b4778334cc6228f	2026-02-18 15:30:18.307+00	f	2026-01-19 15:30:18.480999+00
2a8afbaa-0e03-482c-a13a-318fa8eef896	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	66782649d6ce52b717e7b35d88d5ac343d71a18c3d8dcaa29465b6ddc7ad7a88	2026-02-18 15:25:11.557+00	f	2026-01-19 15:25:11.708801+00
d099086b-4682-4661-b361-c298dc7ca8fc	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	77ff8095e1a6762bdc9fcc3c42199911d6b7414000f8829bd57b86b687168aa7	2026-05-27 16:30:01.931+00	f	2026-04-27 16:30:03.165025+00
959d364f-40a6-4957-be3d-a3d3ffcb15bf	637ad6c2-4ebe-4a34-9dee-4069973bf704	52b0daa36d14a234faf1ccc7ed47e84ca8d6f1d1151519bf4702ee70ce018144	2026-05-29 09:13:49.446+00	f	2026-04-29 09:13:50.135848+00
3df75530-258d-45f2-a811-b4fc79e81605	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fbf7f63aea3319e8b75a145a547f8b2ab0880a602e4f2b3c7a8f7c8e0ebf463c	2026-02-18 15:19:59.001+00	t	2026-01-19 15:19:59.148091+00
332876c4-15b2-4fee-a935-d68fcef4f219	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	66782649d6ce52b717e7b35d88d5ac343d71a18c3d8dcaa29465b6ddc7ad7a88	2026-02-18 15:25:11.678+00	f	2026-01-19 15:25:11.843061+00
4bb9ae62-a8b2-4bad-97f3-7db0707f9b13	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	66782649d6ce52b717e7b35d88d5ac343d71a18c3d8dcaa29465b6ddc7ad7a88	2026-02-18 15:25:11.696+00	f	2026-01-19 15:25:11.861461+00
14e862d4-f100-4c07-a5a9-29264c20a15f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	66782649d6ce52b717e7b35d88d5ac343d71a18c3d8dcaa29465b6ddc7ad7a88	2026-02-18 15:25:11.723+00	f	2026-01-19 15:25:11.891766+00
062e7a0d-afc5-4502-a727-4399990cb1eb	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	af53eb3041063e87ed982415d2d87ad49d10d15c8574e425740d22fe8cff7add	2026-02-18 15:21:55.987+00	t	2026-01-19 15:21:56.505869+00
aa3374ee-3439-418b-83fd-fe8b62d14be0	637ad6c2-4ebe-4a34-9dee-4069973bf704	bf9bb9745592bf8f8ad9fbd31241a39f4abb25d8377cf12e06db11af8c60b77e	2026-05-29 10:11:44.833+00	f	2026-04-29 10:11:45.560759+00
64ae2eae-529a-474a-8126-6ff65aad3da1	637ad6c2-4ebe-4a34-9dee-4069973bf704	cb8ef6c702dca10ec17b76e388792a2a93dce65c07ff41c630ee0b62b47780a9	2026-05-29 10:38:27.068+00	t	2026-04-29 10:38:27.808427+00
121708ce-a62b-447c-abb2-f8c86acf95c1	637ad6c2-4ebe-4a34-9dee-4069973bf704	0a60722acb10290fb9dde2c0b660a58b84d50104c258c8b8362d489176f4b804	2026-02-18 15:33:17.152+00	f	2026-01-19 15:33:17.689847+00
d3ae8962-c375-4e5e-af04-c18d9c662c77	daa74fd2-afa3-408a-b50b-f1ffa476d608	81a2627a5fab3ec4a156573cacd4556c86edf42768ab343a3151b003ddf0b959	2026-02-18 15:21:57.006+00	t	2026-01-19 15:21:57.526264+00
7cd7dc60-6dbd-4b23-9992-02e634d9a5a2	637ad6c2-4ebe-4a34-9dee-4069973bf704	6dea5c42d61642bfe0d3ba6ed773cfff375d43332540ce733ac9d17905c27d09	2026-02-18 15:35:59.145+00	f	2026-01-19 15:35:59.675947+00
e0974388-eaef-444f-b697-95e2da51e01a	637ad6c2-4ebe-4a34-9dee-4069973bf704	05ecf9cdc4a9bae8ac2eb6f30ee33cbb008dd2d9b78134fc613c0144515839c1	2026-02-18 15:38:47.67+00	f	2026-01-19 15:38:48.183663+00
8a65c7e2-c4ba-46d0-8c20-fa456a4393fc	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6013aac5b04454d5df15011351cffc6e53daf112583346131b4778334cc6228f	2026-02-18 15:30:18.114+00	t	2026-01-19 15:30:18.265003+00
3ce51dff-d9c4-4683-b544-45bb74062de1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c1d4bc071712baf3397fd6f6f1f866f1e97886b556954337c1b200997068b430	2026-02-18 15:39:53.991+00	f	2026-01-19 15:39:54.170625+00
6c159101-e0c7-4f6b-8422-6eb43d51c87e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6013aac5b04454d5df15011351cffc6e53daf112583346131b4778334cc6228f	2026-02-18 15:30:18.239+00	t	2026-01-19 15:30:18.411438+00
3fcdf2e9-8bc9-44be-be27-cb615ded8e90	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	9e553f89adcf18fcf28fdf8125a3e480e90f4a50aaeb512f02954a32f4f4bf93	2026-02-18 15:39:54.908+00	f	2026-01-19 15:39:55.086743+00
53b2eed3-8cb3-4804-b11a-e1eafe99cb15	daa74fd2-afa3-408a-b50b-f1ffa476d608	f3e181fe86b288e7728279c779adcf2d2a0df0643f5be88fecb85232e1cce0f4	2026-02-18 15:35:15.539+00	t	2026-01-19 15:35:16.071125+00
799249e7-c4f6-4dfe-bc47-7edaf743fa5c	daa74fd2-afa3-408a-b50b-f1ffa476d608	26413f6d5dc3ffd52595795e7b814376c44e67e5565b79e55ce227e516fbc724	2026-02-18 15:44:44.311+00	t	2026-01-19 15:44:44.836542+00
f2c398a0-3be9-48eb-a1e7-fd421960224e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	9b0af90a394c75be193953aa2b2c03ec98ca2c9c1162c1ff4dc85eaf699c0ac6	2026-02-18 15:27:34.219+00	t	2026-01-19 15:27:34.726207+00
99cb70b1-084a-4c5d-abd4-58c234981a6e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	9e553f89adcf18fcf28fdf8125a3e480e90f4a50aaeb512f02954a32f4f4bf93	2026-02-18 15:39:54.66+00	t	2026-01-19 15:39:54.825601+00
18bb25c6-eb19-4f67-9b30-be45de83af65	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1a2085923c869a8c4ac2296c46b10c594fec35899231574f7b435370fc8535ac	2026-02-18 15:45:28.186+00	t	2026-01-19 15:45:28.360009+00
eef2ea1a-1239-4f20-9fc0-3b3d4c6245d0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	23a833267a88922452be7bd6f2b4bf9dae1b0edaa4752ab76e49bc4ada3c6028	2026-02-18 15:44:48.438+00	t	2026-01-19 15:44:48.956341+00
644d2321-5a22-4577-ba1c-e65f3ef91e9a	daa74fd2-afa3-408a-b50b-f1ffa476d608	138d33ccf77feb45e3998f31c058570d090cc359bb711ce8c80f81f20b567c5d	2026-02-18 15:44:46.903+00	t	2026-01-19 15:44:47.422603+00
d5f8f17d-8a3e-48e5-b7a4-330e7b844f10	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1a2085923c869a8c4ac2296c46b10c594fec35899231574f7b435370fc8535ac	2026-02-18 15:45:28.321+00	f	2026-01-19 15:45:28.508736+00
28111a5c-7d75-47b6-8e2e-8fdc04e9679c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1a2085923c869a8c4ac2296c46b10c594fec35899231574f7b435370fc8535ac	2026-02-18 15:45:28.374+00	f	2026-01-19 15:45:28.563961+00
7af657d7-9650-4011-ae4d-a4793a6a934d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8b72addebd07098c5fed0e47121801601a89e8b2136c5b94e318373c52486347	2026-02-18 15:51:02.661+00	f	2026-01-19 15:51:02.843117+00
ac8c316e-cf22-49f5-ae1a-31c7e7a312ec	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8b72addebd07098c5fed0e47121801601a89e8b2136c5b94e318373c52486347	2026-02-18 15:51:02.676+00	f	2026-01-19 15:51:02.856417+00
6ee2b449-172b-4891-97eb-26afd38211f3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8b72addebd07098c5fed0e47121801601a89e8b2136c5b94e318373c52486347	2026-02-18 15:51:02.863+00	f	2026-01-19 15:51:03.035613+00
4faab6bb-32a0-4235-a458-0fcbd5cf5d27	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8b72addebd07098c5fed0e47121801601a89e8b2136c5b94e318373c52486347	2026-02-18 15:51:02.864+00	f	2026-01-19 15:51:03.044383+00
38f7ab83-f197-4fa5-b4fd-ad9d07d4fdc0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8b72addebd07098c5fed0e47121801601a89e8b2136c5b94e318373c52486347	2026-02-18 15:51:02.864+00	f	2026-01-19 15:51:03.05849+00
ba1ab2cd-4dcc-45ae-b3d9-bc3b53c4e54c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e311be395de7d2257f7a8387d279adaa5ba472340b587e5604d9da1d0dce0809	2026-02-18 16:01:24.163+00	t	2026-01-19 16:01:24.352117+00
c24abe13-557a-4f57-878a-e6ade53d978f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1a2085923c869a8c4ac2296c46b10c594fec35899231574f7b435370fc8535ac	2026-02-18 15:45:28.309+00	t	2026-01-19 15:45:28.484918+00
c82f5a39-1f6c-4b15-9366-175f6c8bf165	daa74fd2-afa3-408a-b50b-f1ffa476d608	d8c8408df2f89e3fed9f70d1552c86af23476a23c576b2ce84cc81ba5d08c3a5	2026-02-18 16:10:33.777+00	f	2026-01-19 16:10:34.324142+00
e031856f-8d28-462f-b9f9-32658683e348	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	281c8baa248daca77a95fd0b742702a516611788d842031bd191dd98c2b3c468	2026-02-18 15:51:03.268+00	f	2026-01-19 15:51:03.442849+00
f5a63c4e-dc91-4045-804d-80b35bfd6d29	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1a2085923c869a8c4ac2296c46b10c594fec35899231574f7b435370fc8535ac	2026-02-18 15:45:28.318+00	t	2026-01-19 15:45:28.503661+00
ddb51eb8-1f04-4828-b04a-16e85762df00	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	281c8baa248daca77a95fd0b742702a516611788d842031bd191dd98c2b3c468	2026-02-18 15:51:03.359+00	f	2026-01-19 15:51:03.538431+00
0b13b6d7-821b-46f4-b69b-cfee8e551276	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	281c8baa248daca77a95fd0b742702a516611788d842031bd191dd98c2b3c468	2026-02-18 15:51:03.414+00	f	2026-01-19 15:51:03.594911+00
449df12c-3f89-4d16-8cbb-cdcd80d52361	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	539e98d887d502fe02c3cf41003fc1f1f83ce172610b89d14f53728f466ed4b0	2026-05-28 05:49:51.753+00	t	2026-04-28 05:49:52.224992+00
777b6e37-fffa-4e78-933f-14c4c141a1c6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	fa48f81f3d77d3faba152edb0b80424a68c232690a12210e66d31c47430aea93	2026-05-29 09:15:52.501+00	t	2026-04-29 09:15:53.192165+00
0f5fa00f-72b2-4390-a2bd-5b672d1b87f9	637ad6c2-4ebe-4a34-9dee-4069973bf704	87df4db213fb1854672f7ce0db6bb27fa16db0ca878cc5df5ec3c1b9e694893a	2026-05-29 10:13:09.634+00	f	2026-04-29 10:13:10.360156+00
75d2d789-625a-468e-a8a1-c1af1ebfbff9	637ad6c2-4ebe-4a34-9dee-4069973bf704	59c795cab8f8ff3f48731b3876f79d9c959efe3c33b40b5c508b3cffec0b5817	2026-05-29 10:38:27.66+00	f	2026-04-29 10:38:28.400432+00
e2cf0230-54be-4299-8223-9460823e3a7b	daa74fd2-afa3-408a-b50b-f1ffa476d608	d8c8408df2f89e3fed9f70d1552c86af23476a23c576b2ce84cc81ba5d08c3a5	2026-02-18 16:10:33.874+00	f	2026-01-19 16:10:34.425051+00
f2dd791c-177a-448f-b01c-8ce0f4656155	637ad6c2-4ebe-4a34-9dee-4069973bf704	a74641fb458f34082cbfdf4eb3fa42fd94f1c2ad10bef4f8f4e12fade5f5d25e	2026-05-29 12:32:29.509+00	f	2026-04-29 12:32:29.935278+00
6284662e-02b7-4593-b32a-a3bb57082e16	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e55f1610f2393a5cd1ece4d2c30bdca02498c4393ababa6c235ffe709552d091	2026-02-18 15:56:09.799+00	f	2026-01-19 15:56:09.981404+00
2bb10303-541b-4f7e-912b-484a8aef0000	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e55f1610f2393a5cd1ece4d2c30bdca02498c4393ababa6c235ffe709552d091	2026-02-18 15:56:09.822+00	f	2026-01-19 15:56:10.005036+00
b7ecb973-c614-427e-b055-abf6d150e2a9	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	cc06c06378522b263c985d3e2b6af7a9ff2b9a8eac9fc39f13c2e2fe32cac7a3	2026-02-18 16:07:08.387+00	t	2026-01-19 16:07:08.588991+00
e8dc1d5f-bf5b-45b0-aa47-33e2584598a6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	281c8baa248daca77a95fd0b742702a516611788d842031bd191dd98c2b3c468	2026-02-18 15:51:03.08+00	t	2026-01-19 15:51:03.259743+00
94f80e73-5341-4940-b1af-311ff3750c99	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e55f1610f2393a5cd1ece4d2c30bdca02498c4393ababa6c235ffe709552d091	2026-02-18 15:56:09.93+00	f	2026-01-19 15:56:10.124587+00
9125df9e-ea18-4f99-a602-ac4aa6cad736	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e55f1610f2393a5cd1ece4d2c30bdca02498c4393ababa6c235ffe709552d091	2026-02-18 15:56:09.939+00	f	2026-01-19 15:56:10.132766+00
455d0a76-58e8-476e-be56-737069e5d8e2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	281c8baa248daca77a95fd0b742702a516611788d842031bd191dd98c2b3c468	2026-02-18 15:51:03.112+00	t	2026-01-19 15:51:03.291232+00
340f7cca-adf7-47fa-b4b0-f380d2412fec	637ad6c2-4ebe-4a34-9dee-4069973bf704	c575a8adae733e010ca08dd6a96fc80f500d9869812539ae87ab681adc07c978	2026-06-03 06:41:30.258+00	t	2026-05-04 06:41:28.776878+00
e8b04b25-56b5-4f14-91fe-c856d8c3ed38	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	73891bc4e3b2f1e220bb77133ae44a150945ca8527005a093ebc96bdfdfaf86b	2026-02-18 16:12:27.994+00	t	2026-01-19 16:12:28.186929+00
6315334b-0304-4966-8d04-dd5966b8e886	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3ff14794f509e36bf6268e61de13e3d513671be0334f6bc8c8da5ed69fdb92b1	2026-02-18 15:56:10.171+00	t	2026-01-19 15:56:10.374252+00
599f3692-a9b8-4740-886f-698450142393	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e311be395de7d2257f7a8387d279adaa5ba472340b587e5604d9da1d0dce0809	2026-02-18 16:01:24.277+00	f	2026-01-19 16:01:24.463742+00
985596c9-b204-4fbf-99ed-3e252197e1c7	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	53f96a7dbfbf1331f7f87876c303d08758f6d56a5ed87f116c9c15c73a739508	2026-02-18 16:06:14.102+00	t	2026-01-19 16:06:14.642339+00
9c7e4dd3-98c0-4c5b-83dd-ec48dfabdb80	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e8242f027f635244ea4e2b123172acb574d2aece5b8ce367ff02de6c4112cbcb	2026-02-18 16:18:39.764+00	t	2026-01-19 16:18:39.968823+00
e5b58bea-70fa-4014-9e44-d72b0f7ed6a5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	07521b902f8bf5e9942b3327ae43d6c58bdce88044d7332646f2b0e23119abc9	2026-02-18 16:22:34.432+00	t	2026-01-19 16:22:34.988404+00
48276bf2-7d7d-4637-89e5-81b745b17e4f	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	decd42fd9c7c6dda65eeee0d36af30ab1e28c12b452b008f1cbc54ef0f7719ca	2026-02-18 16:23:49.231+00	t	2026-01-19 16:23:49.451621+00
abe1f21c-c78f-4454-879d-2e76f65e65a2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	12c94bb533f20ce8ba6a5b03409e10a79bcaca5f4c9c06055a93ad8848c63a6c	2026-02-18 16:35:15.76+00	t	2026-01-19 16:35:15.992811+00
aa53256c-e488-49e9-8d88-8797309e7122	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	87a34ad0aeb8641a1ccfd40b45f525324aedba6cc06bf27c0b1c1ae6906e0fcc	2026-02-18 16:40:36.983+00	t	2026-01-19 16:40:37.225061+00
ff65f6c5-e95f-4cc6-91c4-ad8bccd74e52	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0bdc7036b670b86ad50f30c36b182bfc28c9d517372485b14a21c783c2fed608	2026-02-18 16:29:26.976+00	t	2026-01-19 16:29:27.186036+00
1170abdd-f513-40dd-b67c-b92a4404b807	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	12c94bb533f20ce8ba6a5b03409e10a79bcaca5f4c9c06055a93ad8848c63a6c	2026-02-18 16:35:15.769+00	f	2026-01-19 16:35:16.006152+00
8fc97da9-c88a-4285-b685-5347c662a8e3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	12c94bb533f20ce8ba6a5b03409e10a79bcaca5f4c9c06055a93ad8848c63a6c	2026-02-18 16:35:15.785+00	f	2026-01-19 16:35:16.022014+00
f87c911d-fdb6-4cc1-91fe-031e22e4f9fb	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	12c94bb533f20ce8ba6a5b03409e10a79bcaca5f4c9c06055a93ad8848c63a6c	2026-02-18 16:35:15.793+00	f	2026-01-19 16:35:16.031911+00
50d8186a-74cc-40f4-8dec-6270674f6341	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	8d76fc2e1680560b1a9aeeac81d0db4a59c40e2449a4177142acc8f288a63cd7	2026-02-18 16:45:45.852+00	t	2026-01-19 16:45:46.094493+00
2be6dd0d-5378-4314-b4ce-ab3ce950e632	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1b55e541dd4a54181aeacbf5e7df32beaade4a880e0de5a4326ab40f58898562	2026-02-18 16:27:38.632+00	t	2026-01-19 16:27:39.194063+00
8e9f394c-0ad9-4eb1-bac4-f1073ad6398c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3d0674d61ca4ec0f15ed0902f1c9360ed781a4c288c796695c84b9e6b55f64bd	2026-02-18 16:51:19.237+00	t	2026-01-19 16:51:19.505662+00
50f6ba41-f8ac-4b6d-8ec2-da9f9973063f	637ad6c2-4ebe-4a34-9dee-4069973bf704	c96800b1ca4c71981faf5814d5539279e9105b24174452e637c294d811956b0c	2026-02-18 15:47:26.868+00	t	2026-01-19 15:47:27.440498+00
39d99498-a506-4235-adb9-25ddf051efd8	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6a7251e2c216211960c62957b95ca489ad4ce59ccae180bb379ac5be459c6607	2026-02-18 17:00:00.211+00	t	2026-01-19 17:00:00.773381+00
cea95fd5-45d2-4d5f-804a-59a4fc9ef98e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ccaee039399c29f7c73e7bf88ea3af762f25b080b5ff8ab41d5100b1d5c31414	2026-02-18 17:00:03.846+00	t	2026-01-19 17:00:04.109782+00
e0a9f33a-ccc5-4bcd-9cff-b490d8a683a7	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	337494031b0a4734800554b20fe2c9ba9e46f5bb3f4708bf9e9938cdc94ac387	2026-02-18 17:05:54.527+00	t	2026-01-19 17:05:54.789247+00
afcde1d0-8ecd-45d2-824d-39986f33fa87	637ad6c2-4ebe-4a34-9dee-4069973bf704	6ff217017667518e164fcdd69040ef528fb8c5c0fc2be937123b3c0966c2f96c	2026-02-18 17:01:53.777+00	t	2026-01-19 17:01:54.338603+00
b3518e06-5d39-4759-9bc7-8b25639aef2e	637ad6c2-4ebe-4a34-9dee-4069973bf704	1b1dead64c45d218b85c7784a56499f166a5b4b9876d4e35de0b45f7773f9b53	2026-02-18 17:11:50.79+00	f	2026-01-19 17:11:51.369014+00
dddc46ea-206a-4c5c-9a76-a3b219d25d92	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c39ae68f9c410e75587e1449aa2d82be9b7319daf1639b5f001b6c788f104242	2026-02-18 17:05:17.968+00	t	2026-01-19 17:05:18.548867+00
43310f09-40a2-4014-896d-bd5d25373320	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c60a89314d41ef0bf4be823b508fde9f5560efc2258160f784e07fd753934915	2026-02-18 17:10:54.624+00	t	2026-01-19 17:10:54.880733+00
3386ba10-535c-48ca-9bcd-4fa9cb861dd8	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e1ae01caa4edfdcc6adc92f21d1ad503e113c436dc822890aff9b8d7860d2ba0	2026-02-18 17:15:20.281+00	t	2026-01-19 17:15:20.857182+00
b1a0cee6-6693-4c47-9930-3d1ae990c064	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	7532f728e737a3c3eacb1a0f5ebf4af319d68eac5f9afaca6d8aa236581eecf9	2026-02-18 17:46:25.128+00	t	2026-01-19 17:46:25.703866+00
56398b31-d170-4cca-892f-7ac9dbaef486	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	f1827d5c78506866073e276dccc9d7fa4ccf82cc41c5e2f26e58eca9adceb7d2	2026-02-18 18:00:27.692+00	f	2026-01-19 18:00:28.292604+00
a0e90bb6-3ec1-4855-9469-930ade7dee0e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2020833fffe4e5799a7b23e87bf196ff1791a7207ba9ec801d58a23fd0083974	2026-02-18 17:27:20.714+00	f	2026-01-19 17:27:20.996699+00
10c19f65-00c0-4066-b2ae-901f409ac8cf	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2020833fffe4e5799a7b23e87bf196ff1791a7207ba9ec801d58a23fd0083974	2026-02-18 17:27:20.729+00	f	2026-01-19 17:27:21.008557+00
a2b95dd6-594c-4e86-bd51-d603dc4c81d2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	994e87a0247d4673171d2ea47a8268b2eca216caf5daa3063f83449491f6f329	2026-02-18 17:16:02.543+00	t	2026-01-19 17:16:02.809404+00
23b58d8d-503e-4dc9-aa28-1f7b2322d7fb	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2020833fffe4e5799a7b23e87bf196ff1791a7207ba9ec801d58a23fd0083974	2026-02-18 17:27:20.866+00	f	2026-01-19 17:27:21.142284+00
e256f595-01ad-4c25-967e-639699ca03dc	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	f292f339eb6863555371874766e2379b19db84a2a800697a868ef5cd84b573bf	2026-02-18 17:23:36.751+00	t	2026-01-19 17:23:37.322192+00
7e40ffa0-de62-4fb6-be2d-b20162c69aa7	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	038de3e5ad8c469696a3b5a8450cec367597b60e29bf9c8763df8f36cd0dd1bc	2026-02-18 18:02:07.686+00	t	2026-01-19 18:02:08.267859+00
e4b65b8f-a2c5-4df8-9e3c-3906832e4599	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2020833fffe4e5799a7b23e87bf196ff1791a7207ba9ec801d58a23fd0083974	2026-02-18 17:27:20.671+00	t	2026-01-19 17:27:20.931818+00
cf6aae4c-524d-43b5-a28f-8ffa729ec22d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	653af5bdcab825f104fb8ca5d9329b84bb431bb2a32d90d3ce09ac0752dfa661	2026-02-18 17:30:17.065+00	t	2026-01-19 17:30:17.631666+00
5182d1d7-e0e4-4858-8a5e-53b7caec75da	daa74fd2-afa3-408a-b50b-f1ffa476d608	2bd1df0b30ff29211a62cd73f677df1a34bf4bd739ea24e7ced792b1e26fd1eb	2026-02-18 17:08:19.057+00	t	2026-01-19 17:08:19.632575+00
a32a67a1-1817-4597-986d-58b5ffc0aa58	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	cdd014e9bc88449d7a9eb18e000458db4e79ef9d682616f213b8a16c73ed5d59	2026-02-18 17:32:48.569+00	t	2026-01-19 17:32:48.849537+00
7edadce3-2afb-4658-a358-2e9b845aff86	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c1a6acfaa252e794851eb2a01365290d059472db6e80e8f282861fdf82434858	2026-02-18 17:39:55.86+00	f	2026-01-19 17:39:56.130202+00
c6195f52-321d-488a-8480-e8e22c18a4cb	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	cdd014e9bc88449d7a9eb18e000458db4e79ef9d682616f213b8a16c73ed5d59	2026-02-18 17:32:48.603+00	t	2026-01-19 17:32:48.883603+00
5b6fc904-1563-4d8f-8f1f-b61d43b1da5d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	beabc4c90b8d7e2ff9816216091e7f583ae02081013f99f7d5e97d8d9a86c6ce	2026-05-28 06:20:12.012+00	f	2026-04-28 06:20:12.499111+00
81540035-e7cd-4f1b-8c8e-79f52965f624	637ad6c2-4ebe-4a34-9dee-4069973bf704	f761922cc71996f1569f20d42247cd5c8a50d26cd5074e29c05bd220ce7fd384	2026-05-28 06:20:16.84+00	f	2026-04-28 06:20:17.327568+00
bf47579e-e832-4e2e-ab98-cf7816370fed	637ad6c2-4ebe-4a34-9dee-4069973bf704	d7731bc55f6dc43d8c9e2585d7b9c5b35364a63ebd53980e4427cef5dc56d959	2026-05-29 09:21:19.902+00	f	2026-04-29 09:21:20.598064+00
47a42b77-0a76-4622-9625-0321914f2396	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	20d7cb9a253d9d31847809b9b7221ea1fd71f73f231c762d4e3eb12e2d4aa1a7	2026-02-18 17:35:26.457+00	t	2026-01-19 17:35:27.04653+00
44882f63-2886-4a45-b46d-7bec5ebfa569	daa74fd2-afa3-408a-b50b-f1ffa476d608	df8c38e69968b427835a477a10dec9a5bdd252b7ea6c69c4930781904027938c	2026-02-18 17:38:48.297+00	t	2026-01-19 17:38:48.882055+00
828c46bd-6969-4c78-be1f-586514700564	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b2b168d1f756c88d58c6ba19f32c6cf83a4e0213c04e74cebc43f75ac2e03b95	2026-02-18 17:41:00.396+00	t	2026-01-19 17:41:00.991179+00
de98c344-c005-49bf-a6a1-4d6a54b68868	637ad6c2-4ebe-4a34-9dee-4069973bf704	dfe82e5ed38955c8b118b47e21a2eaeb65a0e012b46f3b7a6465c5a6b1a712b7	2026-05-29 09:21:24.001+00	f	2026-04-29 09:21:24.698005+00
cfaa0aea-88f2-4a0a-959f-d5dc8e3fc5f4	637ad6c2-4ebe-4a34-9dee-4069973bf704	9b3dba0e5772a8da49048ffea4b0bdb2b69deda9b412a615f987b58f6188190d	2026-05-29 10:14:55.748+00	f	2026-04-29 10:14:56.475272+00
969a3f76-149a-4c09-9ab0-6197916234d3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	d809a3a6d80d0d73a396ec878b68b14bb66be9dd4d3f09500a3d78a67256aef3	2026-02-18 17:39:56.082+00	t	2026-01-19 17:39:56.36877+00
09451ad7-0d07-42fe-bb5d-f97d9bde68ae	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5a7d304f2f4ae5c1fb8b7241f2ba568b4cae3504f30eda48077835cea5473bcb	2026-02-18 17:49:10.409+00	t	2026-01-19 17:49:10.68804+00
2ac59ef9-fa17-44ea-a122-5aa7cdb2347d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c945c9001389d3850a400bb8e90413141d75702619bdad15ce31aebe9579a265	2026-02-18 18:01:13.277+00	f	2026-01-19 18:01:13.573201+00
2a0dab06-63f0-408c-ae6a-5a5164be8147	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c945c9001389d3850a400bb8e90413141d75702619bdad15ce31aebe9579a265	2026-02-18 18:01:13.321+00	f	2026-01-19 18:01:13.628114+00
02e5303d-0894-412e-aa61-505676cb7c00	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2114faa95b261caee71b818a6a4c787c5da0a932bf05c773294eb055ec2d570e	2026-02-18 17:55:08.716+00	t	2026-01-19 17:55:09.313581+00
e5e5cc3e-b57f-4090-8679-7ece683ee308	637ad6c2-4ebe-4a34-9dee-4069973bf704	9cd83515255e4c076e7cc58099b6111b20a5499cc015c2b3a555b268de871d3b	2026-05-29 10:49:07.084+00	t	2026-04-29 10:49:07.829362+00
61c69527-52c5-4fe4-8097-f4409b7750cf	637ad6c2-4ebe-4a34-9dee-4069973bf704	ccf7a09030c4d275177ef9b3b5a3962ef337d0f17adeabd0b7404e191f31c625	2026-05-29 10:49:07.934+00	f	2026-04-29 10:49:08.678675+00
9489799b-b71a-4af0-8305-f750ac5a71cf	637ad6c2-4ebe-4a34-9dee-4069973bf704	1de3fe1ecbef5965223bac7652903083e48d04b95a766bba511e8b327864d905	2026-05-29 12:35:36.33+00	f	2026-04-29 12:35:36.758491+00
1c77b45d-1750-408f-ae8c-e49a4198febf	637ad6c2-4ebe-4a34-9dee-4069973bf704	afcb0b6e0bf4036abb4814281eb7d2de343d3db287b674ca3845b41e77bd6958	2026-06-03 06:59:14.332+00	f	2026-05-04 06:59:12.859603+00
4bcb95a7-3537-4e1e-971c-2dce6cdfaa55	daa74fd2-afa3-408a-b50b-f1ffa476d608	ab7723efb7986fc7ee889a23f8e68741cc1e9395d626e8a74287487e2c67a6f7	2026-02-18 18:07:48.013+00	t	2026-01-19 18:07:48.624611+00
d53a6fae-0fb2-49bd-91ba-3d95e3a70080	daa74fd2-afa3-408a-b50b-f1ffa476d608	fce722c0b904f9c4bf91f41096b288bdafec88ac6ce9982a8387603dd00795b1	2026-02-18 17:45:41.939+00	t	2026-01-19 17:45:42.525338+00
3ef9045a-3d13-4606-92f3-e8ac58033cd2	daa74fd2-afa3-408a-b50b-f1ffa476d608	c53c53129ad78646120b1ade1d795b308dce34d8bb9388661858cf1b9fe22e2f	2026-02-18 18:07:47.976+00	f	2026-01-19 18:07:48.581009+00
45618cd7-b57f-442f-828e-a192475de9d0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	70193f3aef47107c3c68e65986054cadeff26298177f3cf1eb4941c1013dabed	2026-02-18 18:07:30.609+00	t	2026-01-19 18:07:31.193939+00
45bd6eff-4363-45ee-8a54-d2d4f9b55743	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	63aac8a205f5ef850cae0f70d17153c035d77a937fadcce8a140ca9bd3b4fdad	2026-02-18 18:13:49.144+00	f	2026-01-19 18:13:49.760004+00
769569a6-f383-4b84-ad56-099a1cf06892	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e5a77868d0516245adea5f056e4b89210d946759a0c3be283e7e621e0afb44bd	2026-02-18 12:37:11.633+00	f	2026-01-19 19:37:11.657553+00
137b4d21-c83b-4831-8823-e5716b33077e	daa74fd2-afa3-408a-b50b-f1ffa476d608	4f443e30db0ebe79b99070e52037900964ddfed3ec9e7b8ccc23b2e1d47ff4fb	2026-02-18 12:38:26.821+00	f	2026-01-19 19:38:26.844239+00
0fe18695-128f-4ffa-8f69-3ada3da27832	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4fb7bef36cc073c6741efcf19313fd7a97bf36b53a34059f403aa6d15fe33e7f	2026-02-18 18:01:26.28+00	t	2026-01-19 18:01:26.569437+00
3700fb6a-2b6c-42a7-a002-bfa382201b5e	daa74fd2-afa3-408a-b50b-f1ffa476d608	41bf0e1e002b9681830ed05ed73d1afeffa9be621fde15cdcb8ec0a51a65a602	2026-02-18 18:13:29.784+00	t	2026-01-19 18:13:30.367886+00
ddac3647-5831-41da-80cf-b12e6002e1e7	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5e66ad4ff88723c9eb855937b8e7ccecb6a04b8351784569e3aa7fdf2f2ec5a7	2026-02-18 12:39:09.221+00	f	2026-01-19 19:39:09.240088+00
689cc0cd-ce5d-48ea-a12d-6bcd88d3f2c8	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4bb3a2b441c80e8721f0b6aec8eaa5a82a4a6150e7ac059c6c08b6b561a7f004	2026-02-18 12:39:33.22+00	f	2026-01-19 19:39:33.243759+00
aa1aad94-063c-480d-8ffb-5148b37267cb	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ba8f313333a48fabb3f77046779f1b3a364521fd9d4d8cd82673e0a0859093a3	2026-02-18 12:40:58.927+00	f	2026-01-19 19:40:58.951513+00
fd5656ae-ce45-43b6-b015-419cd2f4abaf	daa74fd2-afa3-408a-b50b-f1ffa476d608	3fa1c9336dcc420bef2f9766e31187555b13d167253cb2e180d45be5623f6699	2026-02-18 13:00:43.823+00	f	2026-01-19 20:00:43.845703+00
359e7e94-6607-4b73-ae9e-660be182f4ef	daa74fd2-afa3-408a-b50b-f1ffa476d608	090d5e21ab4021cf6b546084a8dc093bc81f295f36b2238e61ba9ff3fbff3d68	2026-02-18 13:09:52.926+00	f	2026-01-19 20:09:52.944269+00
59d0b022-0893-4816-93fa-623da74b9984	daa74fd2-afa3-408a-b50b-f1ffa476d608	6d8513a2054e6141773b5796c8d01db26a35cdee4211a6c672ccc5a309ece305	2026-02-18 13:10:22.02+00	f	2026-01-19 20:10:22.044185+00
59fc6db2-8d06-4271-8b5d-01d26baf6009	daa74fd2-afa3-408a-b50b-f1ffa476d608	2c0c92429edd4e72115e6a67cfec53ad2e2b4ab0aeb4d7467156b3f709989344	2026-02-18 13:10:40.125+00	f	2026-01-19 20:10:40.148823+00
d6ca4d93-b598-4f56-aef1-3052ad935495	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	859cfac7fd05070e90b583e0a1ddc24770f91ae9c856bcea3d38345c70cfcba7	2026-02-18 13:13:51.824+00	f	2026-01-19 20:13:51.848394+00
b519250e-06cb-4185-afcd-60abcd06ab51	637ad6c2-4ebe-4a34-9dee-4069973bf704	8a8f7dccffec19e5de91ba949aed9c4292b8abb6266a318bfcbc3c2df93f84a6	2026-05-28 07:51:53.419+00	f	2026-04-28 07:51:53.959225+00
6ea3a95d-3da4-4e4a-ab7b-f28d080bd3ba	637ad6c2-4ebe-4a34-9dee-4069973bf704	b933d39305882ce8962d8e25e296959786600493bda39ef06574e2d70ef2a616	2026-05-29 09:21:35.241+00	f	2026-04-29 09:21:35.937543+00
69562d6a-9fc3-454d-ba27-1d6675ca216e	637ad6c2-4ebe-4a34-9dee-4069973bf704	c24215c9b312c3853512ef043ab777d784784ce46cd704c64b739b124c7c493c	2026-05-29 10:17:55.568+00	f	2026-04-29 10:17:56.299165+00
57175e97-7b2b-4614-9336-6bcd19c0141d	637ad6c2-4ebe-4a34-9dee-4069973bf704	77ac2f41f1588a873c50bc2c3f145529d03b8bc2db01113b729a2d8d328152c8	2026-05-29 10:52:04.76+00	t	2026-04-29 10:52:05.508544+00
566d3897-7ec3-4448-b0a4-50a081406ae1	daa74fd2-afa3-408a-b50b-f1ffa476d608	e5a0f021d868bbf676fbc4b48b62c7c9273bf3d5e38c5ef3a60183891223e8d5	2026-02-18 13:40:00.319+00	f	2026-01-19 20:40:00.342883+00
172df5a7-18bd-40ce-b883-4312730e83f6	637ad6c2-4ebe-4a34-9dee-4069973bf704	ae0dd72081585f4b679b4de0769f6ed39ae0f65a54081c4b0c29aafe874097d6	2026-05-29 10:52:05.324+00	f	2026-04-29 10:52:06.070712+00
04d8a4c7-99aa-4776-bb67-5df033287bb2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a6ebfc071797cfe3aebd6841ba6abab2966335a704ea7b542a49ca371515119a	2026-02-18 21:29:07.85+00	f	2026-01-19 21:29:07.528919+00
a2866c40-ba26-48c8-8cdf-7ca793d7cdea	daa74fd2-afa3-408a-b50b-f1ffa476d608	f7f0dc8d3a079c011b52c59fb1b5b0f37e4a602615bebbad82f581a18e02f1ae	2026-02-18 21:35:08.891+00	f	2026-01-19 21:35:08.583336+00
b66a40cf-e3db-4701-9080-54568181f5bb	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	cd579b5ee8e8d375c8241823d06df4e5405ea44b36e6008d5edcf18a5b1e8d27	2026-02-18 21:41:06.005+00	t	2026-01-19 21:41:05.728012+00
4de90e8c-ddc2-42df-9bef-8da85a5e55ce	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	9fdcd0dc4c7ca59a972f8ecf1b2a43a466173ccd3e3d831104909ac3da9b78c4	2026-02-18 22:11:25.153+00	f	2026-01-19 22:11:24.849329+00
1a974294-006f-4e64-8fe1-ef3f7d8e94e6	daa74fd2-afa3-408a-b50b-f1ffa476d608	57167d4e5be85d8cb80de5e32bc2abea9aa4a61135cdb47872f116a9bb5bc1f6	2026-02-18 21:41:42.285+00	t	2026-01-19 21:41:41.970331+00
8041e7c0-c6f4-420e-b408-e3a3cf734b24	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	f267f86f9db8ed2df55ad3e90d73cb72d3f8f9587ba56db30e2f70bb0174cf50	2026-02-18 15:24:49.274+00	f	2026-01-19 22:24:49.300708+00
4fb67b5e-a022-4480-b144-897e4bc996eb	daa74fd2-afa3-408a-b50b-f1ffa476d608	47362f437cbcf20e1966875ee219d03a82ec6e2996283f166cd4cf3597b2edd7	2026-02-18 22:23:41.533+00	t	2026-01-19 22:23:41.296423+00
c1494a32-5b9d-4055-b137-60081631e9f0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	46dae02a611bce28ec091dba103cef452cd1699bd55d549da3164b76cb21b61c	2026-02-18 15:47:16.272+00	f	2026-01-19 22:47:16.298526+00
f688c673-df8f-4607-9e0b-901bad25d85e	daa74fd2-afa3-408a-b50b-f1ffa476d608	afd8c82f77022a506aac8ffa9598c7e504e2469998dccd5793763c30c305055b	2026-02-19 00:08:01.102+00	t	2026-01-20 00:08:00.938697+00
6b6d5cd0-6851-40f2-bc0c-6e75fb0c93e5	daa74fd2-afa3-408a-b50b-f1ffa476d608	ea306d8667212fd88d59c4ca1803c644bdba83ca7f316220d3e9289ada5c895d	2026-02-18 22:45:37.336+00	t	2026-01-19 22:45:37.113954+00
031ef6ca-fb49-4e95-b3a5-067930927184	daa74fd2-afa3-408a-b50b-f1ffa476d608	357d1fddf558f1f32e3af33851e5057054924d172ba374a04443cf62f7849ddb	2026-02-18 22:23:55.01+00	t	2026-01-19 22:23:54.797762+00
51f66b04-d014-4c5b-8cdb-f4aa61380ca0	daa74fd2-afa3-408a-b50b-f1ffa476d608	26fd285cec0db5775ccb52cef5990c532731597cd57f870b4c4acb017a8812c8	2026-02-18 23:21:32.175+00	f	2026-01-19 23:21:31.995437+00
44e0bcb5-2b34-4007-b037-987ce9584200	daa74fd2-afa3-408a-b50b-f1ffa476d608	26fd285cec0db5775ccb52cef5990c532731597cd57f870b4c4acb017a8812c8	2026-02-18 23:21:32.218+00	f	2026-01-19 23:21:32.026199+00
168332ef-64c4-4457-a8c2-2a1d80720e9d	daa74fd2-afa3-408a-b50b-f1ffa476d608	26fd285cec0db5775ccb52cef5990c532731597cd57f870b4c4acb017a8812c8	2026-02-18 23:21:32.196+00	f	2026-01-19 23:21:32.026207+00
2e61bcd5-5184-4304-805d-8992cdd50648	daa74fd2-afa3-408a-b50b-f1ffa476d608	1479235b750ec92c274651d4d0f26071f100ccf171e6c86ee24336bf7f24aede	2026-02-18 23:24:01.673+00	f	2026-01-19 23:24:01.499444+00
9648e9bb-590c-46f4-b08a-74b4579a6ff3	637ad6c2-4ebe-4a34-9dee-4069973bf704	8da08d36903ff9179f89baa1093aa39a8568e7f4584193f305f88709c525249b	2026-05-29 12:36:53.738+00	t	2026-04-29 12:36:54.167495+00
e6f46d1d-c91a-4dba-ad52-a724490686f2	637ad6c2-4ebe-4a34-9dee-4069973bf704	1f1486cda72096c578809e656995d86a890a6caea6b73a840c0db13b206a17d0	2026-05-29 12:36:54.33+00	f	2026-04-29 12:36:54.761139+00
e3ed5b68-0008-4758-b663-8418f2fdbcd2	daa74fd2-afa3-408a-b50b-f1ffa476d608	26fd285cec0db5775ccb52cef5990c532731597cd57f870b4c4acb017a8812c8	2026-02-18 23:21:32.144+00	t	2026-01-19 23:21:31.974032+00
05dd2963-0579-45ce-bee1-043c327c6219	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	85a562b5e3aca3d323235a12d5f16e7fb11733ec5dab1905823603bdef917795	2026-02-19 00:10:40.476+00	f	2026-01-20 00:10:40.308989+00
50fcbe01-3a84-43d5-8775-a8b46c575659	637ad6c2-4ebe-4a34-9dee-4069973bf704	2ae5a2729829b8b099b83813f797fb8fd91f55d41775bae03c6bf2296032942c	2026-06-03 07:08:02.58+00	t	2026-05-04 07:08:01.113976+00
e47ac4c9-80d4-4f60-baab-2d28d0dc49d3	637ad6c2-4ebe-4a34-9dee-4069973bf704	437a48f747b07679105e1d31310ea71afe72061483f481df410527a1ff9e7e6f	2026-06-03 07:08:02.979+00	f	2026-05-04 07:08:01.512986+00
498ca97c-816c-4cdb-acc6-f536580ca073	daa74fd2-afa3-408a-b50b-f1ffa476d608	080eeefa2c103350f14919899b5ac03a50d889610449dac8e9858faddb07e934	2026-02-19 00:20:45.503+00	f	2026-01-20 00:20:45.333119+00
df32b95e-8ebc-47e1-87c4-b27236716088	daa74fd2-afa3-408a-b50b-f1ffa476d608	080eeefa2c103350f14919899b5ac03a50d889610449dac8e9858faddb07e934	2026-02-19 00:20:45.417+00	t	2026-01-20 00:20:45.243561+00
3080a546-f6fb-4263-8595-a9c9070b573b	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a5bbd4555a238668336500d77776cccf766b986d56532b78e3f98d9f974c3fcd	2026-02-18 18:17:05.408+00	f	2026-01-20 01:17:05.432098+00
545046ad-d923-43ac-9ea1-3f1680f40b47	daa74fd2-afa3-408a-b50b-f1ffa476d608	fbb54f5e3033b7f94a241b3060ebef18f31f16efcfb6fda75740d5b1bdfa52ce	2026-02-19 00:25:47.485+00	t	2026-01-20 00:25:47.333243+00
329ac178-8ade-4226-9765-7fde5f808615	daa74fd2-afa3-408a-b50b-f1ffa476d608	27965b42cba6287849ad37db50d92cf570dc7e7e2454a194c304254211290c45	2026-02-19 01:22:23.867+00	f	2026-01-20 01:22:23.718792+00
49745d86-4061-4547-bd28-c7369c6e521e	daa74fd2-afa3-408a-b50b-f1ffa476d608	d2f0060e1334b9071cb3a5c7ababf3154060009149943a43456ac830bef1a4b9	2026-02-19 01:23:32.692+00	f	2026-01-20 01:23:32.541929+00
115e48cd-5104-4c1e-8506-fa66e1636cdb	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	9b52156e36f825d38915ef37b9a076a13ed78d63e05a33ca4ad930b746115b82	2026-02-18 19:58:54.782+00	t	2026-01-19 19:58:54.702433+00
203a6cca-e2bc-47c0-a3ab-16a7a144b4d9	637ad6c2-4ebe-4a34-9dee-4069973bf704	efed34658aa363b013ac3c294c8fbebc0ab66f7cb055f0fd059694c1e9b0f689	2026-02-18 21:35:18.199+00	t	2026-01-19 21:35:17.889521+00
a8b413d4-73d0-45ba-b67e-477ba6d519f6	daa74fd2-afa3-408a-b50b-f1ffa476d608	db24338dfd015d7c8ec5496937f6b3b3f8cf6e367fec3fd59125242db2337403	2026-02-19 01:44:44.302+00	t	2026-01-20 01:44:44.173725+00
9c669694-34f4-4c53-af84-33c5382f7411	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	d719cf319d2d50c8242a7164fd5462c12ef7e465ef16c5f178b06b9625f5ad0b	2026-02-19 01:50:14.24+00	f	2026-01-20 01:50:14.45034+00
c5e3fdc3-8208-444f-900a-6c7a4c7fe347	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	d719cf319d2d50c8242a7164fd5462c12ef7e465ef16c5f178b06b9625f5ad0b	2026-02-19 01:50:14.201+00	t	2026-01-20 01:50:14.404422+00
b968938a-094b-4457-bccf-305e67cf84f3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ff9b083167b6769b23f32ad65b947ea69f6a5ca9551b25dfd4cbd47ada7200ef	2026-02-19 01:55:34.958+00	f	2026-01-20 01:55:35.172546+00
1be48984-2844-46ed-b987-707e222a5df8	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	d719cf319d2d50c8242a7164fd5462c12ef7e465ef16c5f178b06b9625f5ad0b	2026-02-19 01:50:14.239+00	t	2026-01-20 01:50:14.448329+00
0077bcf3-c4bc-40c7-ba42-47c08839547c	daa74fd2-afa3-408a-b50b-f1ffa476d608	77abfc4754ba057df59fb245cebeb7d3afb3bea709e57239396a84057a0e9674	2026-02-19 03:18:31.396+00	t	2026-01-20 03:18:31.317658+00
55833739-1666-426e-bc2e-1ba9141085f8	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0199bca6157e75ec15fe2070127967db4b831a2aeb8dfb831e94f2b749fc5485	2026-02-19 02:02:54.955+00	f	2026-01-20 02:02:55.177439+00
c49025da-194e-41c2-82d1-26e8040abbd4	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4e303a40472175ee223d00390a618c11f7a978be88713cc593276fad743c4772	2026-02-19 02:19:32.549+00	t	2026-01-20 02:19:32.786427+00
2f19bfc0-1adc-463f-b3e4-ba39e5152307	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	920f9f519ad3ee0f301da998e82f333a2374df9b160418200556304b19ad29ff	2026-02-19 01:55:36.046+00	t	2026-01-20 01:55:36.271943+00
7804abac-d371-47bb-99af-fd42f9da690b	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	88c582be7197caf2ba0e50009566452edb8be9b8113404f7227ba34065412204	2026-02-19 02:02:55.084+00	f	2026-01-20 02:02:55.317448+00
fe6318c0-162b-4e59-87a2-eacaa5bb4089	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	88c582be7197caf2ba0e50009566452edb8be9b8113404f7227ba34065412204	2026-02-19 02:02:55.151+00	f	2026-01-20 02:02:55.388283+00
c27246dc-36c2-4ba0-9a3a-76fa1faf6990	637ad6c2-4ebe-4a34-9dee-4069973bf704	ee5634648a33044805e411bb16ee14a614473091cb5844acc5aa21596368fa15	2026-02-19 02:06:15.512+00	f	2026-01-20 02:06:15.382178+00
aa058eb3-c70c-43b2-abc7-d0623f8b6eb7	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4d27d27796e22fc0d718b44603014b417e8b4f5f1bafaffeff5a6e0f46e7a4cd	2026-02-19 02:03:15.605+00	t	2026-01-20 02:03:15.846605+00
9b32240b-6c5a-4fec-a7a8-5a1682b00e96	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	9e343813cc14153e1d00988c730ab87d4db4ff5aed3b491cc09919291c674001	2026-02-19 02:19:26.319+00	f	2026-01-20 02:19:26.555937+00
437df7d8-3382-4542-a264-9fc8882111b7	daa74fd2-afa3-408a-b50b-f1ffa476d608	c8a2d7433212292ff267685d751b5e25233e25544dfee5b3f36623409f8c3979	2026-02-19 02:29:46.363+00	t	2026-01-20 02:29:46.255287+00
9f0deea4-e71e-4d98-9d56-90a6424e8c73	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	cd7f12b5e05df856c6ec6f55cb3124a4a0a70d5c1542633466dcf1742a0d4df0	2026-02-19 02:08:15.059+00	t	2026-01-20 02:08:14.925455+00
cfdcdbec-bb65-4eab-8954-b461d59d50e7	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	991f5aced5451a36350e3e67712f8a68b9cedc3df1007894576b9f7c7c897f3a	2026-02-19 02:39:23.258+00	t	2026-01-20 02:39:23.162701+00
0deb5814-96ac-4fb1-8540-b69cfbea171d	daa74fd2-afa3-408a-b50b-f1ffa476d608	3892a8c77aa5d387228ead33008026a5ca01bf72c120613f3a44932473c5d2a3	2026-02-19 02:35:01.782+00	t	2026-01-20 02:35:01.678583+00
1abea1d0-5ba8-4dea-8533-c8059d939859	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	61748b3e7e7028388ad4a0edd8135266bc666872d1723dd857193a425d867d9f	2026-02-19 02:51:09.945+00	t	2026-01-20 02:51:09.858107+00
61f3468a-8c44-443f-bae3-50e89f664e53	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4faef1a37f37b88b48c743c28f2e0bdbdcad7d4e8dcdf47c58a0387d49c9074d	2026-02-19 02:58:26.424+00	t	2026-01-20 02:58:26.33559+00
26b0c7af-937e-4786-a003-7028be85367c	637ad6c2-4ebe-4a34-9dee-4069973bf704	50f36e72b8881555cd684a939db24f1faedb4cf5996434b4a764f400011eb046	2026-05-28 07:54:35.705+00	f	2026-04-28 07:54:36.246403+00
7842e792-60f3-4817-92bf-ac39280a42de	637ad6c2-4ebe-4a34-9dee-4069973bf704	c5f1970dc22fbd1a72367ed24b6168912a0f921d65ac11d614d957d8c95dccad	2026-02-19 03:20:16.385+00	t	2026-01-20 03:20:16.311674+00
dd7697e6-73ab-4f74-8e39-5b5c4a2787a3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	9998ea603b4a1cb76e6a8ce39ca4aa204b6025ab55637ad41111f92673b2d12f	2026-02-19 03:16:04.665+00	f	2026-01-20 03:16:04.579416+00
45a2b65f-3e7b-4c2d-96ed-a3ae170222ff	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	9998ea603b4a1cb76e6a8ce39ca4aa204b6025ab55637ad41111f92673b2d12f	2026-02-19 03:16:04.669+00	f	2026-01-20 03:16:04.587758+00
a963e731-1c92-4e11-a4a0-5e9372c67950	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	9998ea603b4a1cb76e6a8ce39ca4aa204b6025ab55637ad41111f92673b2d12f	2026-02-19 03:16:04.675+00	f	2026-01-20 03:16:04.592264+00
c1875d11-1230-4a44-9416-d827ef6a5c98	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	0650adc5d6844bac31313cdef52a1ca485d423e0603b934fa8a7aae80752b8e0	2026-02-19 03:03:32.971+00	t	2026-01-20 03:03:32.876461+00
26a9db0c-0ccc-4afe-8943-34c377031293	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	9998ea603b4a1cb76e6a8ce39ca4aa204b6025ab55637ad41111f92673b2d12f	2026-02-19 03:16:04.845+00	f	2026-01-20 03:16:04.778435+00
e5602b57-3f30-4162-bbd8-c495e523fdb5	637ad6c2-4ebe-4a34-9dee-4069973bf704	64f7472e4e1e8142e1f85889e5197378f90ad9a602e99ff13e56aad513e55819	2026-05-29 09:24:42.917+00	t	2026-04-29 09:24:43.613431+00
9cdbc607-c682-4ece-80b7-414dac22dfdd	daa74fd2-afa3-408a-b50b-f1ffa476d608	e8cc1df170e9221b0b91629141e070af16d6f791907ec7b726c4f5877043fafc	2026-02-19 02:51:55.518+00	t	2026-01-20 02:51:55.426807+00
e8a4a877-46d5-4eb7-980f-e175837193c4	daa74fd2-afa3-408a-b50b-f1ffa476d608	45d43a858aa7b70aed60f00ae1715e02b9ba2db83226ba7b5ec95e6aa81b4c73	2026-02-19 03:18:19.911+00	f	2026-01-20 03:18:19.833161+00
e75e72b9-a318-463e-95ef-db11d3f13b9e	daa74fd2-afa3-408a-b50b-f1ffa476d608	45d43a858aa7b70aed60f00ae1715e02b9ba2db83226ba7b5ec95e6aa81b4c73	2026-02-19 03:18:19.951+00	f	2026-01-20 03:18:19.876962+00
feab78f2-7665-4099-bc63-cee2c80a2327	637ad6c2-4ebe-4a34-9dee-4069973bf704	79004a4c91703af18d894b0f7146403c6d8e83848e7f229dce3105cc531e24ab	2026-05-29 09:24:43.324+00	f	2026-04-29 09:24:44.021483+00
5a755eba-401f-4cb8-a864-218434ebe0ac	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	17286f7ca79bda66903c63a8ff74f57d386dba1a69371ec738be8f00577e7ff8	2026-02-19 03:20:48.139+00	f	2026-01-20 03:20:48.06214+00
49889078-ecc9-4d62-9a50-3b164b4bbf21	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	f5d8cc206ef6bb7a72d2b0a3f1c085d813dd7ffc514f6f6351f64e47f9125acf	2026-02-19 03:28:11.886+00	f	2026-01-20 03:28:11.798459+00
acef189a-4525-4169-ae33-de2290cdb3d3	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e4b435ce9e1bdf08da314e59a145ba4433a69e4bd1358f53220b14c46ab5817c	2026-02-19 03:29:29.818+00	f	2026-01-20 03:29:29.744578+00
eb8b8cb9-9351-4edc-a5ed-a7f4c323d759	637ad6c2-4ebe-4a34-9dee-4069973bf704	cbe9084c75329c1767d5bbd10e688178ba203f45ba53cd81ab9bc9c9c50cf73b	2026-05-29 10:18:10.753+00	f	2026-04-29 10:18:11.484609+00
0d4b5633-f80b-4a19-9cd3-792f4e221190	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	01460350338bef732b8cd4f1a61016741cb8a1e35db2d1f58a140f836921cba5	2026-02-18 20:29:58.587+00	f	2026-01-20 03:29:58.612762+00
11038f30-8e18-47e2-9c6b-51dbf04088c5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4d3e07ff1da0ab2fccf9a1e07dfcd6301445d758ef317d212a83481254df0c6a	2026-05-29 11:36:25.544+00	t	2026-04-29 11:36:25.938813+00
fa8c3aa0-c68a-40ed-a59e-080228adce53	637ad6c2-4ebe-4a34-9dee-4069973bf704	2029215d08602140ca9c6d54e096399d8d3ec13622317d84da791a5596fe006e	2026-05-29 12:38:35.013+00	f	2026-04-29 12:38:35.447884+00
bc8d7e39-f73c-4f3b-94c7-198b768c2a42	637ad6c2-4ebe-4a34-9dee-4069973bf704	c9640e18931abf2f2d8a6e92c88ec4ef106eecb6759b96dfede74fe5a606d2c7	2026-06-03 07:13:44.281+00	f	2026-05-04 07:13:42.819478+00
0a8c5d07-36a1-46d7-9ab0-3151e7079797	daa74fd2-afa3-408a-b50b-f1ffa476d608	53c07699418e76e0074f5a8e37c917b4199431e623a4c2d5bcc4022fc422fb97	2026-02-18 20:30:37.697+00	f	2026-01-20 03:30:37.722458+00
8eb5c5fc-9ff9-459b-b85b-d91c235c6fe3	637ad6c2-4ebe-4a34-9dee-4069973bf704	cc0c047ead9c15456dbc74c5e128c6b9536a4f162613e95958c4ba223235f621	2026-05-28 07:54:57.342+00	f	2026-04-28 07:54:57.881173+00
18af8213-98ad-4f45-b966-df2931d0bbf9	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4ab2ea8e4b76b1adaa166492b57f6ba0e9c1ce2e4f22010589699c3a5c006d8e	2026-02-18 20:36:32.297+00	f	2026-01-20 03:36:32.321853+00
e5e9b126-3629-4746-861e-a80fc5f64e17	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	99b891bc5e11ed1999ccd333da110170b9d97cc6f7da3648c1a1c2e899b3a5bb	2026-02-18 20:37:13.897+00	f	2026-01-20 03:37:14.011692+00
350d2c9a-f011-4f15-93bc-41f09ca2f776	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3e60f4718b8480b7d0011b623d87735b58f3ed2a0b302acf3084003368da6e61	2026-02-18 20:38:23.084+00	f	2026-01-20 03:38:23.109221+00
c51037d7-7a21-430a-9941-73935c960f86	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	659a2bb46e453f5d1796a5181ef967094654432300523ca909594edd2c9af36f	2026-02-18 20:41:13.094+00	f	2026-01-20 03:41:13.11962+00
4b58d500-0900-4542-9d16-be0cc0aa444f	daa74fd2-afa3-408a-b50b-f1ffa476d608	78bb9438c38480609135790ad9c487b25eded39fdb33f387dbd727ef866fc3d8	2026-02-18 20:49:40.592+00	f	2026-01-20 03:49:40.616953+00
a25eb2db-9d45-4ac0-9859-55c8236ddce8	637ad6c2-4ebe-4a34-9dee-4069973bf704	bed70693f1e57f5390934dbb5312f43e8063f4a013a3442ec34980833665bb94	2026-05-29 09:24:57.532+00	f	2026-04-29 09:24:58.229364+00
0ddd68e4-09f1-4318-a83d-7d2184916aa3	daa74fd2-afa3-408a-b50b-f1ffa476d608	bd3ca520df721d7c279e6440f9e5a1083be0cc1c15b5f76e7f7cf3992f0ac711	2026-02-18 20:54:14.585+00	f	2026-01-20 03:54:14.610477+00
74178a6c-2487-4ada-92d4-3223057b6ab0	637ad6c2-4ebe-4a34-9dee-4069973bf704	cf19f2a2e86a3683b8c5177001916361e0fdabfeba13b7e64ee20ab2c17f766f	2026-05-29 10:18:35.864+00	f	2026-04-29 10:18:36.592885+00
78b93e32-d7cd-4f0a-ae66-040867df37f9	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	69a2fdf47201969fe5c165935f7f273ee44bcdce339904e875cdf305b5cf6906	2026-02-18 22:04:47.808+00	t	2026-01-19 22:04:47.801624+00
3d84ddda-7b67-4dbb-b34d-8c99e7bb60b7	daa74fd2-afa3-408a-b50b-f1ffa476d608	40ff0bf115a1a5c93ab0808b0dd7474a68c2c34a3a268ff630e63fa3c2a0ac93	2026-02-19 03:57:33.664+00	t	2026-01-20 03:57:33.590833+00
808a6b9f-e870-46e2-bd93-da34c5c99734	daa74fd2-afa3-408a-b50b-f1ffa476d608	c2bc7dfe2e65b6457c5f8e03940c9570f84f5390f0bb01b1faff0b3816e2bb7f	2026-02-19 04:02:49.846+00	f	2026-01-20 04:02:49.788415+00
96026f84-4901-4f5d-9b9a-1eb6a3f77c0c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	d2f2295f3639a46b7fbcc485ad0197af0dc308a9695e78a1e4c5256993bb4468	2026-02-18 21:06:15.492+00	f	2026-01-20 04:06:15.517745+00
a76afd14-8395-4e21-ae36-c109795fee0f	daa74fd2-afa3-408a-b50b-f1ffa476d608	c2bc7dfe2e65b6457c5f8e03940c9570f84f5390f0bb01b1faff0b3816e2bb7f	2026-02-19 04:02:49.676+00	t	2026-01-20 04:02:49.60491+00
886f6ba9-5c5b-47e0-b097-a16aeb877327	daa74fd2-afa3-408a-b50b-f1ffa476d608	518ff08686157e6ee577fc7d056e7827486b083c08a3ed84758464f71ce673cb	2026-02-19 04:09:25.422+00	f	2026-01-20 04:09:25.371442+00
d51acc07-d65e-4298-8d06-3f2a6139bea7	daa74fd2-afa3-408a-b50b-f1ffa476d608	518ff08686157e6ee577fc7d056e7827486b083c08a3ed84758464f71ce673cb	2026-02-19 04:09:25.243+00	t	2026-01-20 04:09:25.182554+00
e0c34927-f111-4d4d-bfb0-8a19b14baab0	daa74fd2-afa3-408a-b50b-f1ffa476d608	a5347fdebf8684a86448df92d110f4082ea474cea3b9570c710b8c95ccf02045	2026-02-18 21:17:33.095+00	f	2026-01-20 04:17:33.120139+00
b0312413-192b-43b1-b7a6-d3213aa8ad9e	daa74fd2-afa3-408a-b50b-f1ffa476d608	cbf60baa85e2b9ae0e376fe4ec83bd1da7cf851e5bc1acbae92eb62d075a91ba	2026-02-19 04:16:01.618+00	t	2026-01-20 04:16:01.561538+00
90a4023f-4edb-43ef-81b4-f1dc79ab073d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b81cdd5001e528fa513429855640cd3add5ae962df0f0e804e1157a47683de32	2026-02-19 03:47:31.629+00	t	2026-01-20 03:47:31.553587+00
d6d9de47-152c-4746-a1a5-3aa67ac0b252	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3e2535421be83a421ab93a4440d5a2af4fc1661a88e63bfbec9727f720b8b2a2	2026-02-18 22:19:25.389+00	f	2026-01-19 22:19:25.434823+00
233b96f8-1a6d-4c0e-a5a3-be7c5f295184	daa74fd2-afa3-408a-b50b-f1ffa476d608	c896f0143be7cb9e75d3ea12f9ccfa0bed931311ec176416d87097f1bad9808c	2026-02-19 04:23:21.602+00	t	2026-01-20 04:23:21.556589+00
280ed5d5-23a2-4b8a-8ba1-25210f48591b	daa74fd2-afa3-408a-b50b-f1ffa476d608	aee30c78254b800543d527721097366f902d036012c0b6f0ef07bf04e4062f65	2026-02-18 21:45:38.82+00	f	2026-01-19 21:45:38.79757+00
6b105ba7-d2e6-4065-aba3-d6e7a4a41fed	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	cee01c99c772e1760ba6d901570cbd4430125628819b96b3488b6a537c32db2d	2026-02-18 21:43:17.673+00	t	2026-01-19 21:43:17.634175+00
fd6ed86c-b71f-4e65-ac17-1ec7cd5ea30a	daa74fd2-afa3-408a-b50b-f1ffa476d608	aee30c78254b800543d527721097366f902d036012c0b6f0ef07bf04e4062f65	2026-02-18 21:45:38.642+00	t	2026-01-19 21:45:38.604816+00
125cdddb-c43c-41d7-b6d0-e459497b0699	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	db9fac65db0d8306636c7cb43472e9a9aa982696d196a24179f6813b689117a7	2026-02-18 21:49:12.076+00	t	2026-01-19 21:49:12.038588+00
f326d87b-5ade-4002-8f26-60df6b73e3a2	daa74fd2-afa3-408a-b50b-f1ffa476d608	74b4b2548bc7e00cf229fe9cf8b882a4d80d8d4a1c45c4da1be585c75a896141	2026-02-18 21:52:03.254+00	t	2026-01-19 21:52:03.240821+00
90c70834-26be-45d2-8707-b90a2b67c4df	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	bbff0225a38f63628c05b713e5c2b4ebd5e66d9768709f84e1c5a7b8479d719f	2026-02-18 21:54:31.241+00	t	2026-01-19 21:54:31.226703+00
1c789325-3b62-4442-a8b4-78074c0d2dfb	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	d6d78097c97eafa0b7b2bd54beb1a9f594c02cbc22c6d4a52a4b7e765c1ba125	2026-02-18 21:59:42.623+00	t	2026-01-19 21:59:42.614857+00
e3bd9b30-f8ac-45b1-9b8a-bf49bfbd373a	daa74fd2-afa3-408a-b50b-f1ffa476d608	d25cf75d353e0ab39d60e4757a1f0b901f33a76319319020ac93de69a9f1fc07	2026-02-18 21:57:51.95+00	t	2026-01-19 21:57:51.940689+00
2606e27c-7cd4-4666-b21d-3e3658fbe951	daa74fd2-afa3-408a-b50b-f1ffa476d608	576f2ab8bc5f0c9a72678b5f669973038a2e09ca457246ecba720a446ad1b5db	2026-02-18 22:08:02.019+00	t	2026-01-19 22:08:02.011952+00
5e66673b-895b-4736-91a8-6a127d43afaf	daa74fd2-afa3-408a-b50b-f1ffa476d608	abda13f80990a86deffff01fdbd5cb42f163adbe62b40a906fecc66a964b2acf	2026-02-18 22:14:18.065+00	t	2026-01-19 22:14:18.06665+00
6d3c5a68-0070-47bc-bbc9-6a058139bf44	daa74fd2-afa3-408a-b50b-f1ffa476d608	a13bd4e4dca26e01584442e08ea4ac554c7ba877936e212ee2e60fa688a1b7c6	2026-02-18 22:26:37.089+00	t	2026-01-19 22:26:37.007806+00
692d6f5c-9099-45b0-88ae-f6259afed720	daa74fd2-afa3-408a-b50b-f1ffa476d608	fe1364b1a4d458ec2887d4ea3170c6b2a40f239d410cca19842741a9b15b67f6	2026-02-18 22:21:08.746+00	t	2026-01-19 22:21:08.7483+00
d5ce75ea-5ea8-424e-a4e6-abe4d9a5df8e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	87cdc70120f36c59144a43e2d9dbffcefdc2e0443ceb2f436b770afd0158c852	2026-02-18 22:15:37.215+00	t	2026-01-19 22:15:37.198557+00
35166741-2d97-4409-9f6d-200e493cec58	daa74fd2-afa3-408a-b50b-f1ffa476d608	8b48583f6ad8e9617b08b540a0a6892ccfc2eb92aff0d75044014c7a5130e661	2026-02-18 22:28:33.096+00	t	2026-01-19 22:28:33.085559+00
165a4866-61a7-4117-9049-fdc89d908ffb	daa74fd2-afa3-408a-b50b-f1ffa476d608	3b9384e0d1264d23d013dd3ca3de49d409c73121371c8375d82de053d0ed225a	2026-02-18 22:26:51.384+00	t	2026-01-19 22:26:51.304296+00
79195040-a2df-4ae7-98a7-37b70cae00a8	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	85b7fe8e23cc6b9445bcfe2e4fd61ddfc3907d835c147b888eb2cb4941f6d6b3	2026-02-18 22:30:25.85+00	t	2026-01-19 22:30:25.844069+00
44c1ac68-42c7-462a-a93c-58e59f9be786	daa74fd2-afa3-408a-b50b-f1ffa476d608	711590100fbe1a3293bd8c4e3c479144b5fe9c370bc9a5ff0c761d9574fa6c46	2026-02-18 22:34:38.695+00	t	2026-01-19 22:34:38.606696+00
bbe48275-1cb6-4ef8-b405-a65b57172c42	daa74fd2-afa3-408a-b50b-f1ffa476d608	a54b50df95faf6f01447924f992c60a2fe446aa5632d7230abe03f5493f42018	2026-02-18 23:05:25.608+00	t	2026-01-19 23:05:25.472835+00
80c99085-41ef-48db-b717-cf6627ef56b8	daa74fd2-afa3-408a-b50b-f1ffa476d608	67c9f1f8c6e7b0c73b0ed099d045b93fc7cc713aa006f772f5396d0b0c0f83e4	2026-02-18 22:33:35.515+00	t	2026-01-19 22:33:35.504527+00
7bce38f3-0162-4714-beda-63e06c5ca076	daa74fd2-afa3-408a-b50b-f1ffa476d608	f264738ea1387b401bd7858fb44ee0fbb3a1e2436928ecf5813153b580dd3bb0	2026-02-18 23:30:46.789+00	t	2026-01-19 23:30:46.800636+00
b6581e94-4d9e-4493-9d0e-c7a33a1f89ab	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4509574fff1e63ccacd492fb7539e8bb984901e4bfbce566707ed364986fa9b6	2026-02-18 23:02:03.855+00	t	2026-01-19 23:02:03.847805+00
5ca2d812-72f2-4d4f-85e2-8fb89523c161	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4fafbd11095640ad0045e8f96956df5021de1ac8b805e2be29e995e5deb5403d	2026-02-19 00:48:23.302+00	f	2026-01-20 00:48:23.846539+00
b3742c59-7628-425f-965a-10bf4a741d91	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a3f20f6380324427c32ec6a86b916d24184ca48943d91e547cdac1dfee5d8aa5	2026-02-19 00:47:38.052+00	t	2026-01-20 00:47:38.267103+00
8527e84b-2b89-4e5a-9126-9daa82fda1e4	daa74fd2-afa3-408a-b50b-f1ffa476d608	c8324999e2a1c656f79c22b47a3aebec11b4323233e38d872afb5c9d37e69f9a	2026-02-19 00:47:31.315+00	t	2026-01-20 00:47:31.529481+00
c6c92529-2a35-4864-b523-94fac6c1b0a6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	052f8195db2e9f132acba64d20e91f3b33e2c6f299c271df68f51900a828e739	2026-02-19 00:48:31.271+00	t	2026-01-20 00:48:31.816922+00
d0d60dad-0170-47bc-9d8b-7f65f7c47cca	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	341ceb159b886c34a4de15ea4fe07e99b5340f8f82e78b0c8e95697111b28212	2026-02-19 01:17:54.48+00	t	2026-01-20 01:17:54.711384+00
baf3bb0b-883b-4574-ac66-1f26a71b5b53	daa74fd2-afa3-408a-b50b-f1ffa476d608	4bd9c40d88b7938bff4cf102184078b3f440d842e69ee7bc6e59cc921603f2df	2026-02-18 23:06:53.064+00	t	2026-01-19 23:06:52.958392+00
6b057051-adc1-427b-9d64-487a33b508ce	637ad6c2-4ebe-4a34-9dee-4069973bf704	f253126bde1c80b65be260e3dfa6fb67c9cda302c5509347076a3af310fc83d5	2026-05-29 11:38:59.55+00	t	2026-04-29 11:38:59.949223+00
54380ddc-0420-419d-ae1d-893eaa66f590	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	691f89cdff954125e16d7fec75bf0ef0f25e0c0606a69bcedde3169816f94060	2026-02-19 01:19:11.032+00	f	2026-01-20 01:19:11.601748+00
f83c1607-be84-4703-b73c-5777dd45182d	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	6b9dcef78215fa29ed8b1a0e49ec568de2fe9479ef786feb9726f3e8f42eebfd	2026-05-28 07:55:19.714+00	f	2026-04-28 07:55:20.25398+00
01e47d19-f880-4717-87fc-4addfa73a6ee	daa74fd2-afa3-408a-b50b-f1ffa476d608	6a96e5ed35fec825083955f95af87303cabfbee18ed4e68f73438f50b7d688b4	2026-02-19 01:18:10.893+00	t	2026-01-20 01:18:11.124121+00
226d3b7c-a864-45b6-a79a-f29d91dee9a1	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	1f21895af2affa248dfa2ce1fe07a37d60320cea1b984f7eb5509f3b441e4e49	2026-02-19 01:50:17.483+00	f	2026-01-20 01:50:17.727155+00
079ab275-e7f1-4d22-ae62-1c09a82b99d1	daa74fd2-afa3-408a-b50b-f1ffa476d608	f1501d492499701c975dd0228e362f062992b84d41b89c084cb97a8cfa3a2206	2026-02-19 01:20:37.115+00	t	2026-01-20 01:20:36.90766+00
342e2a66-9b03-4837-bafa-55e027433314	daa74fd2-afa3-408a-b50b-f1ffa476d608	9a786a1d9abf935e572fdd0256a05ea7ca5e04bd1de9a44f107809bf70b7b957	2026-02-19 02:08:21.862+00	f	2026-01-20 02:08:21.645061+00
028d9937-8220-493e-ab69-adf65d445317	daa74fd2-afa3-408a-b50b-f1ffa476d608	f62615453e72a91891b79a4092b6ebf24e9a089c1926d6242f97f62ddf313a28	2026-02-19 02:19:02.405+00	f	2026-01-20 02:19:02.663377+00
94fa357d-a8e4-4fdd-88c4-f303633f99c3	daa74fd2-afa3-408a-b50b-f1ffa476d608	c3e9761b6238821f7d2e177c32b3335be7a294283eae636a6ddf9a46af8143e3	2026-02-19 01:48:31.276+00	t	2026-01-20 01:48:31.501312+00
1f2e7e15-6093-4877-98b1-e622f48b89d2	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a6c90e69026f54e4174fee311d427658d30f22ce1e1239262b444bedfb84e114	2026-02-19 02:28:24.908+00	f	2026-01-20 02:28:24.933417+00
75928b5a-5a1f-4395-ad40-7888091d1f1d	637ad6c2-4ebe-4a34-9dee-4069973bf704	61ed3865a6b113a0ce55b0cbf242a1098d3a78c199bd0704ac66364a8721411d	2026-05-29 09:26:07.298+00	f	2026-04-29 09:26:07.996339+00
54816ea3-dfc5-4b83-a5bc-3bad39d48bbd	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c624bf2ea5d1831d7189943fae4ca5d32aedba54aabfcb19286287c5a0666497	2026-02-19 02:04:17.544+00	t	2026-01-20 02:04:18.139398+00
80f2f9ce-d893-4510-a46d-64b2e85084d7	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	49f3e9d9010420aa097923191083e8eade1bb8c86ef1a35e06b754ff0132ec3f	2026-02-19 02:34:36.921+00	f	2026-01-20 02:34:37.540931+00
3dc9d309-4e47-41f1-8a16-f55a71435214	daa74fd2-afa3-408a-b50b-f1ffa476d608	1548c52eca05e3061386a807a5922e41d4f801d3a4a7982a2f282f5cf2f7fcf0	2026-02-19 02:43:05.187+00	t	2026-01-20 02:43:04.934678+00
5fa68628-5613-496c-9a73-179faed26dbe	daa74fd2-afa3-408a-b50b-f1ffa476d608	5a9e7e34f84a6178fabfc6d0e2128cb2ff66e5cea88ec8864d1b29252a0e3c3f	2026-02-19 02:43:06.038+00	t	2026-01-20 02:43:05.784663+00
c226634b-d91e-4918-91e8-e265f4b89a46	daa74fd2-afa3-408a-b50b-f1ffa476d608	c09fc551df4a768ce7b623cfbde28d92be0d97db8800e0e2f806168b10bbcd9a	2026-02-19 02:55:48.438+00	t	2026-01-20 02:55:48.193168+00
98df738b-b493-43e8-b321-b1bcc697dae5	daa74fd2-afa3-408a-b50b-f1ffa476d608	a6c74bd9f77c48e5c325c75b9acd02a5cc0e5737c75bc7a9f9a122b928c15db6	2026-02-19 02:55:55.96+00	f	2026-01-20 02:55:55.715448+00
70868bd0-8e94-4a25-9846-820e68c09be5	637ad6c2-4ebe-4a34-9dee-4069973bf704	f1c27f2f3987eee818439d959eff8d6b9000262874d27fb95a604f27952bef53	2026-05-29 10:19:10.415+00	f	2026-04-29 10:19:11.146321+00
98f28f15-b84a-490a-a411-5a6ad53cd8de	637ad6c2-4ebe-4a34-9dee-4069973bf704	b6e64b20a42b822d985bbe2d3b5a18d448ebdf9e9970b0843b18c82da1015c5b	2026-05-29 11:38:59.943+00	f	2026-04-29 11:39:00.340192+00
f95b5bdb-7045-4268-a91f-aac1e9463017	637ad6c2-4ebe-4a34-9dee-4069973bf704	2eb58b9f4b30e5f71d26ebbbf35145f6a767ca4c5291a339ba0d779ac1336519	2026-05-29 12:39:04.605+00	f	2026-04-29 12:39:05.03544+00
9c9d2e7b-7dd4-4ad1-a9f1-db9f47769c1f	637ad6c2-4ebe-4a34-9dee-4069973bf704	3e9769af3954acd8b111125f3b6c75ffdb9a15486a43ad98eda1107b3439cfaa	2026-06-03 07:15:55.13+00	f	2026-05-04 07:15:53.668972+00
3b40b73d-b1e7-490c-be2e-9f626cef5e29	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ff2737003965b092450057ce3c214ec5ae764de155d5e35710541c4b8d0e0cae	2026-02-19 03:25:58.374+00	f	2026-01-20 03:25:58.399168+00
ba211a3d-c858-457d-8cb8-edacdbf16257	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	afe67d9b1d0c898d651582e8320c4711d1001ca479955a3d4613bbdde4df60f5	2026-02-19 04:16:06.672+00	f	2026-01-20 04:16:06.697276+00
2ed0d3c6-cdf1-4db3-824c-992e611dab4e	daa74fd2-afa3-408a-b50b-f1ffa476d608	72b92b77a53f4eb68a94c3fb67a13fe91642d27a2cd7efb01956a6f85df490bd	2026-02-19 02:23:00.462+00	t	2026-01-20 02:23:00.722675+00
aed06e35-4e62-4342-9a50-e1b07c11e3cd	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	7a790fa98b7a1566c356bdb03e30e56ce8c8bc9e4c7b9cd931c7af4191bfbf11	2026-02-19 04:21:41.617+00	t	2026-01-20 04:21:41.908433+00
3dbe4254-aa91-45e7-b199-fc3a1563de74	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	3ca2a8b71e3d1e5cb66cd5d104246b76c7656c0568e3c4d75021918c0d665e36	2026-02-19 04:56:02.51+00	t	2026-01-20 04:56:02.231935+00
d1092be8-f24e-40ff-a9b2-094aa4883f22	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	ff6e2d0bbdf0e7a737c263d5e0627484a8fa3db3c30d2c8e3da96da09539bfff	2026-02-19 04:56:18.917+00	t	2026-01-20 04:56:18.634548+00
b4907565-ba29-4985-95d2-8d65dbce440e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	7e489beff365e8e17155a7fcfc7acfecf8b151ae200e03344fadd0fb1e597082	2026-02-19 04:56:34.644+00	f	2026-01-20 04:56:34.348884+00
9e005d39-dfac-4a75-a68c-e391c9e99bea	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	d0cc578b1882bacbcabd8cdd04b64193a39779bf8406e5cec15f8b4b41a8175c	2026-02-19 04:54:41.122+00	t	2026-01-20 04:54:41.427529+00
c98cb3a0-2dfb-43ea-af0f-ae97ed01d2db	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	bd7f055d1370a72b0be2cfb35b998a1ab24be8c48365e3d283687dfb8cb5caf8	2026-02-19 05:30:25.442+00	f	2026-01-20 05:30:25.782748+00
1b52cb8c-8018-4778-8eb6-40b395423a22	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	340eba6f0a5d6d38ad1d7399f53589427cf0271135c54751f13e3262b58dc0eb	2026-02-19 05:55:07.275+00	f	2026-01-20 05:55:07.003136+00
19463e86-2d75-47e8-b259-0b61bbfe1c70	637ad6c2-4ebe-4a34-9dee-4069973bf704	14036e510eb20f73f1ce6399ec4cbb97b0a279bc71928b77dd6716342b7ad76f	2026-02-19 05:55:21.277+00	f	2026-01-20 05:55:21.025705+00
77c36f83-0ade-4bae-9da8-fe08f3682935	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	9784e50087e70a560b4afce300e26bd9d5a1c0681b3ddb71d5b86f3366c12cd7	2026-02-19 05:58:19.422+00	f	2026-01-20 05:58:19.801398+00
f91e01c1-dbde-4fd6-838e-cbfb9da44f62	daa74fd2-afa3-408a-b50b-f1ffa476d608	d3aa7c68b397fab5c0d50cefc96c2fca50b7562d5a936663c800fa1f890389bf	2026-02-19 04:27:34.466+00	t	2026-01-20 04:27:34.163509+00
1c78a860-a650-40ee-9447-326ca0168d9a	daa74fd2-afa3-408a-b50b-f1ffa476d608	b41147b41341d2e352097ecac875c7223a59ccae1fff01c93491c319930c51f4	2026-02-19 06:01:37.576+00	f	2026-01-20 06:01:37.325848+00
d3ed0044-3f32-40bc-a48d-efcdee7969e0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	d74cec629d5ccc105f5ce501399b2ee05799bb0be55c31237df65627da7fc4c0	2026-02-19 06:08:37.998+00	f	2026-01-20 06:08:38.025292+00
508899da-8b18-4528-9a04-d3ca925c9fb8	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	e6d3b3dde6be85656c96ade63921932fa65506f8aae6669ef2d5c855ef883fc3	2026-02-19 06:13:41.104+00	f	2026-01-20 06:13:41.130298+00
c028046e-4633-47f7-8d18-64ff4026964c	637ad6c2-4ebe-4a34-9dee-4069973bf704	ee17573573d2b389da4d03ca4b83080f125b386e4f803fdca015602680f469c9	2026-02-19 06:31:35.513+00	f	2026-01-20 06:31:35.260197+00
441fd0a8-6ace-4b21-8596-c501f48724a4	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	dc95f17e2f5453a3fffaa66333bf7cc472901d262567e6d4b790528ede46732c	2026-02-19 08:04:39.053+00	f	2026-01-20 08:04:39.1629+00
2d8f5a55-5c59-443a-854a-e70cdeefeed6	daa74fd2-afa3-408a-b50b-f1ffa476d608	cb98f7d7e7cc9d1b3885d1982e9c83fb08d26cb5de7759102c510a940c43d6fc	2026-02-19 08:05:00.842+00	f	2026-01-20 08:05:00.868776+00
cf057ae8-041a-480e-8033-5f86dd99a110	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	aa30fb47e0df73c809ad06005a2158f7b94aa7383f3cee98a62b47d5de0a767c	2026-02-19 08:47:59.642+00	f	2026-01-20 08:47:59.670388+00
04aa92fa-072d-47cf-95ea-430b64399791	637ad6c2-4ebe-4a34-9dee-4069973bf704	19e84dfeac9a607ed64128a513bcbb86a7bb37e2c9848ee522f86d77dd5a9c43	2026-05-28 08:16:03.905+00	f	2026-04-28 08:16:04.456309+00
cda13f57-5409-4ee0-8b34-71db5df844b0	daa74fd2-afa3-408a-b50b-f1ffa476d608	7ed23c09c13bb4e123bf122c3dd9b69cdb73f089dfe51e3abe1229732dce88cc	2026-02-19 09:04:34.145+00	f	2026-01-20 09:04:34.178471+00
c246ac3b-8ddc-4419-b4fa-dbf694381657	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	909aacf010033e2c95e12f80da6655d181a87555dd5254904c6f1bbe1980c705	2026-02-19 09:15:46.543+00	f	2026-01-20 09:15:46.578958+00
5e6155cd-9528-4adf-a0d1-1dbf7d761134	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	b10259c71f8dd4e8064e45f5100d254ebde71784080cc5bfaf3ef4af30f0ec16	2026-02-19 10:02:33.424+00	f	2026-01-20 10:02:33.452778+00
279aeb33-1428-4e92-bf70-03c823565151	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	d9543828e84e78ee389d253a53724abdffe95f53a0ddef3ece10f1f1331cb4fb	2026-02-19 10:25:13.323+00	f	2026-01-20 10:25:13.343581+00
5255944e-cd77-4239-b335-5ab3472effc4	637ad6c2-4ebe-4a34-9dee-4069973bf704	ade2b255f35b541b9ca18010db5a188d5adfbc2c4b6dffb334d942ebc59104e4	2026-05-29 09:26:43.063+00	f	2026-04-29 09:26:43.763109+00
0de553b6-86ad-4d98-999a-6a9b86ee822e	daa74fd2-afa3-408a-b50b-f1ffa476d608	7e361857a63b7011f613636d4a3eccd78252f59d4ed486601e4942710c3398a6	2026-02-19 10:38:29.707+00	f	2026-01-20 10:38:30.024389+00
33dd7f86-5e5f-4973-8dd0-e937f0448ee5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	5d0c2a5a99ee9bf8482d23998a61a510f7a59236bceae1d467af5a72bf1e88b3	2026-02-19 10:39:06.68+00	f	2026-01-20 10:39:06.894043+00
6c9490e5-811c-4e92-ae74-7aeeff52399f	19fb8f43-fa15-4f8b-ba45-1fb54e8ca426	c677c471db615002ee23cd7094529abd8f70f331d4f7e4cb23d26abdbead42cd	2026-02-19 10:39:17.837+00	f	2026-01-20 10:39:18.071887+00
f19f8e43-6124-4e78-aa9b-849adab4eb1c	2000c3e1-4cd7-4198-bbea-f3701644e504	b964d99912918cd53af204132588ee37161d743f02f18953fedc8266ad5a9d6d	2026-02-19 10:41:15.015+00	f	2026-01-20 10:41:15.037854+00
49c596d8-9ef5-4359-8b50-a9c1a982d2a1	900a56df-1e7b-4d1e-854f-7d8bf34972af	82c4841f917e7c70e187cac31dd1e36fa8ea53e2983ef4daf5466e3bff1db6b8	2026-02-19 10:41:30.91+00	f	2026-01-20 10:41:30.933395+00
8ae853c9-2ea2-4913-a558-c434ed00a5ff	637ad6c2-4ebe-4a34-9dee-4069973bf704	b0f77c4070efbd7280f7d0854ed4f4a4a47cbd5d328374fcc2b8ed9b57549179	2026-02-19 10:41:51.785+00	f	2026-01-20 10:41:52.023026+00
250db244-2b3e-4712-8651-b7f81898db1e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	40f8b937ddf47377d68965cacb4424b0f81dbe8c835b17ff0e1c08ef699f6888	2026-02-19 12:15:06.559+00	f	2026-01-20 12:15:06.58492+00
5d447de7-7e19-4e1f-ad98-2e55f95badf6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	2fc954cc3eb8432f4aec537d031f6219f49754a6718bf428bd23d840de72a444	2026-02-19 12:21:53.19+00	f	2026-01-20 12:21:53.462844+00
33dc05e7-9144-41d0-bf43-46f8ff49911c	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	c5075f9b4ce0ac184da6767ce2357936ffeab005a25f83dbaab3e1b1a9c9b7a5	2026-02-19 12:33:46.97+00	f	2026-01-20 12:33:46.989729+00
0a0a280f-0b2b-4841-85ed-74197be5e029	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	db4a7995007f65457820269d09d2c55f190698b3df94712b73fb2669bb461bfb	2026-02-19 12:40:38.669+00	f	2026-01-20 12:40:38.688634+00
b447a559-0758-4d02-9970-0476052158c5	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	a935985d433c6874b973919bf0b2d7d782899218c4ee8f8a1afdd019e3ddf5bf	2026-02-19 12:42:59.53+00	f	2026-01-20 12:42:59.966645+00
467e2039-e60c-40a0-8b59-3cf59dff48f7	daa74fd2-afa3-408a-b50b-f1ffa476d608	de9051a76e4c9d72b0b4d82c7274ecbaacbe0c434740b02148c928c37226c35e	2026-02-19 12:44:36.596+00	f	2026-01-20 12:44:36.892239+00
d90e8719-8235-4c23-a3ce-f21afa11b6d6	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	4fc15bc9ed54a005398264a7f291aa66722f5384425a1c8fdbf0977853db19b7	2026-02-19 12:44:53.082+00	f	2026-01-20 12:44:53.366524+00
5934f943-2f68-4861-a983-5661f33e38c5	637ad6c2-4ebe-4a34-9dee-4069973bf704	52fb2422aa32445522ed8a546202219cfc3e5aee636b6632955ddf93e2229030	2026-02-19 12:45:10.468+00	f	2026-01-20 12:45:10.751882+00
524aca24-8630-4bc0-9d93-36e6a2861ef0	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	673c775e041b28b8c706055a28d953243ff73f081a500a92153a97db60ac91de	2026-02-19 12:49:12.617+00	f	2026-01-20 12:49:12.074191+00
18dfaf4a-b171-4bb6-a426-620de1d18170	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	80cfb072d0d799b1d6d959479a52cb51935e659aeb96f07fc21add928c503a05	2026-02-19 13:19:11.336+00	f	2026-01-20 13:19:11.357028+00
7c7f4fb5-8132-4fbc-a212-1f8a6094917e	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	7c3776c94b5933fac6f43721601a18a61c65a0b5bbcaeb1625d5c780c3da1085	2026-02-19 13:21:01.232+00	f	2026-01-20 13:21:01.259405+00
4d6ecb05-2a8f-4b08-adfa-3f8855485719	19fb8f43-fa15-4f8b-ba45-1fb54e8ca426	858ef085855e0e35e31d14000134e26e6e043e8a17ebdaa306d73fba04b30040	2026-02-19 13:21:54.732+00	f	2026-01-20 13:21:54.759415+00
a36a205d-0168-497e-b0f6-131cf993f8ff	daa74fd2-afa3-408a-b50b-f1ffa476d608	19a1cdc9e1b9896d883f6932f500731ce96272fbfbed105417051b33b54acd25	2026-02-19 13:22:22.826+00	f	2026-01-20 13:22:22.855035+00
81ff144c-ebc0-4954-b486-d726d1dfb693	56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	d3f8548b4131c93cf9d8df0c1e7f1e3533f47ba67080517d1dee6b2369dd86d7	2026-02-19 13:47:43.627+00	f	2026-01-20 13:47:43.65686+00
7766a8a6-c623-4050-a351-e7ff46bf3f7a	637ad6c2-4ebe-4a34-9dee-4069973bf704	351bdd460960415450ab6bc9c1da31192457498182e134b86409633ddea5ccb8	2026-05-29 10:19:37.694+00	f	2026-04-29 10:19:38.42522+00
7f2d7719-29d9-4c99-83f9-edfba732c8d7	637ad6c2-4ebe-4a34-9dee-4069973bf704	e7812f6325c793f3051e8f45c557d07c5f90fb8328bf1933c8896982c4dcb5b8	2026-05-29 10:19:47.631+00	f	2026-04-29 10:19:48.3615+00
9de99d93-ca0b-4cb1-9601-ece485a11df0	637ad6c2-4ebe-4a34-9dee-4069973bf704	39bfa9567ef16c403730e63e6be5c7569999f9e06ceed1df3bab8dfdc3c05ee0	2026-05-29 11:39:48.333+00	t	2026-04-29 11:39:48.732034+00
ce002e14-256b-4041-b4fa-71b83ea33cd7	637ad6c2-4ebe-4a34-9dee-4069973bf704	a4d3a93af7b4effdcf1bd9fab2924b6bfd5baf71e7442797d58187b220c0ea5d	2026-05-29 11:39:48.733+00	f	2026-04-29 11:39:49.131855+00
e7706402-d032-4e15-9be2-55ce1ea56891	637ad6c2-4ebe-4a34-9dee-4069973bf704	6952ff9eafb4c69fda0ccd069f813c143b1550cdcb38b8f3b7d238d5e5b05787	2026-05-29 12:45:07.854+00	t	2026-04-29 12:45:08.291984+00
b213a492-7eb2-48df-b727-d3921c5096b3	637ad6c2-4ebe-4a34-9dee-4069973bf704	67da5e54f0a9a5cf3177e9d355940c1f8a386bc1fa4a80e14159641f5d58cdd3	2026-05-29 12:45:08.524+00	f	2026-04-29 12:45:08.959898+00
90965802-a4ab-4507-a78c-fa78daaad8b2	637ad6c2-4ebe-4a34-9dee-4069973bf704	f8feb98e209d5bae323a85def459b9eb33550b6270a1d9f7bc005b60d9bc38fa	2026-06-03 07:18:24.72+00	t	2026-05-04 07:18:23.260017+00
e11b9599-577f-4153-9f4d-152da35e7565	637ad6c2-4ebe-4a34-9dee-4069973bf704	627f60252cccc22d761ece4aec7dd60ee083fad83a4399bfd77069ea25f5b4a7	2026-06-03 07:18:25.087+00	f	2026-05-04 07:18:23.626969+00
\.


--
-- Data for Name: table_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.table_assignments (waiter_id, table_id, assigned_at) FROM stdin;
daa74fd2-afa3-408a-b50b-f1ffa476d608	e77b38d9-4f8b-4793-9704-ebe6af343eab	2026-01-22 02:37:32.024453+00
daa74fd2-afa3-408a-b50b-f1ffa476d608	7123df31-d263-427b-b04f-daa7754c1b47	2026-01-22 02:37:32.024453+00
daa74fd2-afa3-408a-b50b-f1ffa476d608	565c2cef-51e5-4964-b94e-603afe1170fa	2026-01-22 02:37:32.024453+00
daa74fd2-afa3-408a-b50b-f1ffa476d608	b4b6dc08-7013-4502-8e04-51a9f34297fb	2026-01-22 02:37:32.024453+00
daa74fd2-afa3-408a-b50b-f1ffa476d608	3675b800-1a92-435b-9c8b-4650c12896e3	2026-01-22 02:37:32.024453+00
daa74fd2-afa3-408a-b50b-f1ffa476d608	24379309-fa06-4632-a43a-fec95ad013de	2026-01-22 02:37:32.024453+00
daa74fd2-afa3-408a-b50b-f1ffa476d608	1c5f4293-df69-4528-9663-7c196c640e04	2026-01-22 02:37:32.024453+00
daa74fd2-afa3-408a-b50b-f1ffa476d608	6b5d8255-fb3b-421d-9de9-b8a10f5f905f	2026-01-22 02:37:32.024453+00
daa74fd2-afa3-408a-b50b-f1ffa476d608	fb8d79ed-aa47-414f-8d16-21c0c72d3d66	2026-01-22 02:37:32.024453+00
daa74fd2-afa3-408a-b50b-f1ffa476d608	63635e5b-d795-4f64-b480-0e3eb75f7377	2026-01-22 02:37:32.024453+00
daa74fd2-afa3-408a-b50b-f1ffa476d608	423ba70d-a275-454d-8a64-159ed6992733	2026-01-22 02:37:32.024453+00
\.


--
-- Data for Name: table_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.table_sessions (id, table_id, user_id, session_token, started_at, ended_at, status) FROM stdin;
72836904-239d-45f8-b4ac-33108c2306be	e77b38d9-4f8b-4793-9704-ebe6af343eab	637ad6c2-4ebe-4a34-9dee-4069973bf704	e51a784f90e57f48f4c99ad9b7b64aa0ce95a081875a7dae5150121686f2c938	2026-04-29 11:52:23.154437+00	2026-04-29 12:45:40.925202+00	closed
ee376d12-d62e-4274-b870-d9aff52e90fa	e77b38d9-4f8b-4793-9704-ebe6af343eab	637ad6c2-4ebe-4a34-9dee-4069973bf704	78bdf84aad1859e3254934f5274ec2f73bf57186c3e598c2b84fc02d9a81a4e9	2026-04-29 12:58:02.906357+00	2026-05-04 06:40:32.197048+00	closed
f5c5e4b5-2882-42d5-a709-701fdd7ae86e	e77b38d9-4f8b-4793-9704-ebe6af343eab	637ad6c2-4ebe-4a34-9dee-4069973bf704	bd9f98eb9cd1407f4be1d169126899bae059da2b634a462d8d467c5f9843f1b4	2026-05-04 07:21:15.244818+00	2026-05-04 07:57:33.600318+00	closed
5728ad8c-e7cd-448d-975c-ee4ec745dcf0	e77b38d9-4f8b-4793-9704-ebe6af343eab	637ad6c2-4ebe-4a34-9dee-4069973bf704	4a654550447f950bd479b66dd893654dcbfe718ffa13fc0a14282c9d5ee16c16	2026-05-04 08:45:12.136999+00	\N	active
\.


--
-- Data for Name: tables; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tables (id, table_number, capacity, location, description, status, qr_token, created_at, current_session_id) FROM stdin;
51e19a6c-3e46-441c-8296-0c4cd3fc23ec	T-20	8	VIP Room	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjUxZTE5YTZjLTNlNDYtNDQxYy04Mjk2LTBjNGNkM2ZjMjNlYyIsInRhYmxlX251bWJlciI6IlQtMjAiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTcsImV4cCI6MTgzMjAyODgxN30.roADb48h0ZklMkMkZyvOTOKrWNC7AZONQyhQhED_k7Y	2026-01-11 12:27:08.394046+00	\N
de82864f-c488-48fa-94b0-9ec91dcd7683	T-15	8	Outdoor	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6ImRlODI4NjRmLWM0ODgtNDhmYS05NGIwLTllYzkxZGNkNzY4MyIsInRhYmxlX251bWJlciI6IlQtMTUiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTcsImV4cCI6MTgzMjAyODgxN30.r6q0GOT2lDttpN8O-zTTAAlLtZd5Bh1dZXWW460mDCQ	2026-01-11 12:27:08.032032+00	\N
bf653253-e854-4068-9b4f-d76c40d9f178	T-08	4	Indoor	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6ImJmNjUzMjUzLWU4NTQtNDA2OC05YjRmLWQ3NmM0MGQ5ZjE3OCIsInRhYmxlX251bWJlciI6IlQtMDgiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTYsImV4cCI6MTgzMjAyODgxNn0.c6w33iDpg3O80YmDKMPQSmo7cnj0Soc34rPY5E79s5g	2026-01-11 12:27:08.120187+00	\N
3675b800-1a92-435b-9c8b-4650c12896e3	T-05	2	Indoor	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjM2NzViODAwLTFhOTItNDM1Yi05YzhiLTQ2NTBjMTI4OTZlMyIsInRhYmxlX251bWJlciI6IlQtMDUiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTYsImV4cCI6MTgzMjAyODgxNn0.rQW6i2ndXw0zuPBqQbDGP0y3F0Bi4X56A5co2hWVXv8	2026-01-11 12:27:08.203154+00	\N
98c761c8-0c11-4c26-a366-efdd1943041f	T-14	2	Patio	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6Ijk4Yzc2MWM4LTBjMTEtNGMyNi1hMzY2LWVmZGQxOTQzMDQxZiIsInRhYmxlX251bWJlciI6IlQtMTQiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTcsImV4cCI6MTgzMjAyODgxN30.L9nG8ho_mnm_pi6m7y01CtSad1s7cqT2eK54M0UoBWk	2026-01-11 12:27:08.031251+00	\N
9e3e212e-b0dc-47db-ac13-d6d65e3f779a	T-09	6	Outdoor	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjllM2UyMTJlLWIwZGMtNDdkYi1hYzEzLWQ2ZDY1ZTNmNzc5YSIsInRhYmxlX251bWJlciI6IlQtMDkiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTYsImV4cCI6MTgzMjAyODgxNn0.98Y-dybyIASwRDhvbDyIAzEFejM02-ODN3JG2Xl2bqs	2026-01-11 12:27:08.372263+00	\N
6f75533d-62fe-473a-858d-cb438bfc07cf	T-10	8	Outdoor	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjZmNzU1MzNkLTYyZmUtNDczYS04NThkLWNiNDM4YmZjMDdjZiIsInRhYmxlX251bWJlciI6IlQtMTAiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTYsImV4cCI6MTgzMjAyODgxNn0.5cWqTVOIRkjwZDevxDgRzSs4Zp1qg45H_1lnf0qL270	2026-01-11 12:27:08.393153+00	\N
43173ecb-baa3-4433-8f3f-b2fc38ea90eb	T-16	8	Patio	Auto generated via Postman scdđript	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjQzMTczZWNiLWJhYTMtNDQzMy04ZjNmLWIyZmMzOGVhOTBlYiIsInRhYmxlX251bWJlciI6IlQtMTYiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTcsImV4cCI6MTgzMjAyODgxN30.PNa9xRatbV8ecJjDwP911HJaGeEWOCchSRCYdJEHzb0	2026-01-11 12:27:08.071227+00	\N
6b5d8255-fb3b-421d-9de9-b8a10f5f905f	T-07	6	Patio	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjZiNWQ4MjU1LWZiM2ItNDIxZC05ZGU5LWI4YTEwZjVmOTA1ZiIsInRhYmxlX251bWJlciI6IlQtMDciLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTYsImV4cCI6MTgzMjAyODgxNn0.3OlAa7aGmwTMKcQvPx8NXpbFmNfHm4HsPkkIoVf3kQo	2026-01-11 12:27:08.165429+00	\N
11ee6fa4-dc93-4939-9709-942c258b1c48	T-18	6	Patio	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjExZWU2ZmE0LWRjOTMtNDkzOS05NzA5LTk0MmMyNThiMWM0OCIsInRhYmxlX251bWJlciI6IlQtMTgiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTcsImV4cCI6MTgzMjAyODgxN30.XqpqevOvIfGtTiBkaF8DRHAimN0eAESM28N-bn0TX1Y	2026-01-11 12:27:08.07703+00	\N
db25b66d-65f7-49bc-a2a5-3fd4fd6af0ed	T-17	2	Outdoor	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6ImRiMjViNjZkLTY1ZjctNDliYy1hMmE1LTNmZDRmZDZhZjBlZCIsInRhYmxlX251bWJlciI6IlQtMTciLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTcsImV4cCI6MTgzMjAyODgxN30.X3a6GXry_16ildHq7ns3WWGRWhf4UhppbSW2_c7GQ6M	2026-01-11 12:27:08.073233+00	\N
24379309-fa06-4632-a43a-fec95ad013de	T-19	2	Indoor	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjI0Mzc5MzA5LWZhMDYtNDYzMi1hNDNhLWZlYzk1YWQwMTNkZSIsInRhYmxlX251bWJlciI6IlQtMTkiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTcsImV4cCI6MTgzMjAyODgxN30.Y9oB5BHJjH67fl8LeRtuBB3Fm_H26J4o819RXcSAMuo	2026-01-11 12:27:08.362253+00	\N
fb8d79ed-aa47-414f-8d16-21c0c72d3d66	T-11	6	VIP Room	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6ImZiOGQ3OWVkLWFhNDctNDE0Zi04ZDE2LTIxYzBjNzJkM2Q2NiIsInRhYmxlX251bWJlciI6IlQtMTEiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTYsImV4cCI6MTgzMjAyODgxNn0.v46uoNJHGz-U-hhFBN_UYsOBYkB4b1dI1SZwiehZlVQ	2026-01-11 12:27:08.315154+00	\N
8ebb60d1-f2ab-442e-a937-d4b7b94cdf2c	T-13	6	Outdoor	Auto generated via Postman script	inactive	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjhlYmI2MGQxLWYyYWItNDQyZS1hOTM3LWQ0YjdiOTRjZGYyYyIsInRhYmxlX251bWJlciI6IlQtMTMiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTcsImV4cCI6MTgzMjAyODgxN30.12ByRKnCXB5TUiBedcTMLEVp1eIDc1Sb56z7_jCIVqI	2026-01-11 12:27:07.993131+00	\N
1c5f4293-df69-4528-9663-7c196c640e04	test457	8	Indoor		active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjFjNWY0MjkzLWRmNjktNDUyOC05NjYzLTdjMTk2YzY0MGUwNCIsInRhYmxlX251bWJlciI6InRlc3Q0NTciLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTgsImV4cCI6MTgzMjAyODgxOH0.teuuNsN9ObC5xErhRC4Jy1YnTcteMBcRTdw8siU2694	2026-01-12 09:57:45.762761+00	\N
e77b38d9-4f8b-4793-9704-ebe6af343eab	T-06	4	Indoor	Auto generated via Postman s	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6ImU3N2IzOGQ5LTRmOGItNDc5My05NzA0LWViZTZhZjM0M2VhYiIsInRhYmxlX251bWJlciI6IlQtMDYiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTYsImV4cCI6MTgzMjAyODgxNn0.JD6fh39lLXWIO86rn7bmNzTbkrDFfKCoi4Na1vR77bo	2026-01-11 12:27:08.25181+00	5728ad8c-e7cd-448d-975c-ee4ec745dcf0
b4b6dc08-7013-4502-8e04-51a9f34297fb	T-03	8	Patio	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6ImI0YjZkYzA4LTcwMTMtNDUwMi04ZTA0LTUxYTlmMzQyOTdmYiIsInRhYmxlX251bWJlciI6IlQtMDMiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTg5MDIsImV4cCI6MTgzMjAzNDEwMn0.gXnHFd5K9jpaxZxsVBxn21xYyLdWNi6CnI9x2rNvhig	2026-01-11 12:27:08.323058+00	\N
423ba70d-a275-454d-8a64-159ed6992733	T-01	3	Indoor	Auto generated via Po	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjQyM2JhNzBkLWEyNzUtNDU0ZC04YTY0LTE1OWVkNjk5MjczMyIsInRhYmxlX251bWJlciI6IlQtMDEiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTUsImV4cCI6MTgzMjAyODgxNX0.XcOHVYQWZS2nSdWPVLKnAp6gxDuPWS_TZGjOeyABY94	2026-01-11 12:27:08.394039+00	\N
85d97994-3541-4784-8562-d182d8efee1c	test530	4	Indoor	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6Ijg1ZDk3OTk0LTM1NDEtNDc4NC04NTYyLWQxODJkOGVmZWUxYyIsInRhYmxlX251bWJlciI6InRlc3Q1MzAiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTgsImV4cCI6MTgzMjAyODgxOH0.s8XXbpwVPlnKqHItr-mbV34enUqBGZaXv9xZocQ6Hsw	2026-01-11 12:27:07.978173+00	\N
7123df31-d263-427b-b04f-daa7754c1b47	T-044	4	Patio		active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjcxMjNkZjMxLWQyNjMtNDI3Yi1iMDRmLWRhYTc3NTRjMWI0NyIsInRhYmxlX251bWJlciI6IlQtMDQ0IiwidHlwZSI6InRhYmxlX3FyIiwiaWF0IjoxNzY4OTEzNjE2LCJleHAiOjE4MzIwMjg4MTZ9._d7SvtNIL1M1iAlx3a6mIkcbzSZwSt_bQnqMcsOCjQc	2026-01-11 12:44:33.553677+00	\N
76259a05-fee4-4af2-80e1-dd7487e2ceee	A61	4	Indoor		active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6Ijc2MjU5YTA1LWZlZTQtNGFmMi04MGUxLWRkNzQ4N2UyY2VlZSIsInRhYmxlX251bWJlciI6IkE2MSIsInR5cGUiOiJ0YWJsZV9xciIsImlhdCI6MTc2ODkxMzYxNSwiZXhwIjoxODMyMDI4ODE1fQ.AqLRzBS9BFxoBlKJcuc3vp3zt0bDAz5ArhLFUd6Q3rE	2026-01-12 10:48:19.442063+00	\N
7f7ce182-be45-400e-8295-1bdd7dbd642b	T-12	2	Outdoor	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjdmN2NlMTgyLWJlNDUtNDAwZS04Mjk1LTFiZGQ3ZGJkNjQyYiIsInRhYmxlX251bWJlciI6IlQtMTIiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTcsImV4cCI6MTgzMjAyODgxN30.3RkpZmS36Oh77JnlDM_YZUymPrASOEYYtbW6K4cL59U	2026-01-11 12:27:07.98522+00	\N
565c2cef-51e5-4964-b94e-603afe1170fa	T-04	2	Patio	Auto generated via Postman script	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjU2NWMyY2VmLTUxZTUtNDk2NC1iOTRlLTYwM2FmZTExNzBmYSIsInRhYmxlX251bWJlciI6IlQtMDQiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTYsImV4cCI6MTgzMjAyODgxNn0.ptzN13Y7fAtUhgFdj4LZ62Mzpd2mQpMuNDk2oZrFEQw	2026-01-11 12:27:08.37815+00	\N
503caaa4-1563-4ef1-8e6f-38ac90544169	T-158	4	Outdoor		active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjUwM2NhYWE0LTE1NjMtNGVmMS04ZTZmLTM4YWM5MDU0NDE2OSIsInRhYmxlX251bWJlciI6IlQtMTU4IiwidHlwZSI6InRhYmxlX3FyIiwiaWF0IjoxNzY4OTEzNjE3LCJleHAiOjE4MzIwMjg4MTd9.8APuQbWltq1V4tNcjq3-F-HLyyR6qmHh1PCI1R-QJXI	2026-01-13 06:58:58.125185+00	\N
63635e5b-d795-4f64-b480-0e3eb75f7377	T-22	4	VIP Room	VIP	active	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZV9pZCI6IjYzNjM1ZTViLWQ3OTUtNGY2NC1iNDgwLTBlM2ViNzVmNzM3NyIsInRhYmxlX251bWJlciI6IlQtMjIiLCJ0eXBlIjoidGFibGVfcXIiLCJpYXQiOjE3Njg5MTM2MTgsImV4cCI6MTgzMjAyODgxOH0.takdMQocK5klYO2neZ1nC8SFKcRqLa-PH58CWSUje4E	2026-01-20 10:37:34.329123+00	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, is_verified, created_at, preferences, avatar_url, is_actived) FROM stdin;
dee3702b-0db6-42af-bcf0-34db44dfc55b	phong lam	phonglam0806@gmail.com	$2b$10$6V783zps77k/2Falvz0z3uczt9URwDy3T2r5Ep4j1J9edaTi0HxsW	customer	f	2026-01-20 10:01:56.15393+00	\N	\N	t
19fb8f43-fa15-4f8b-ba45-1fb54e8ca426	KITCHEN	kitchen@gmail.com	$2b$10$K5kceJ0iBJGQjmedWLk2uuKntd5UY.EvXLxjKMfAS2jUuBsB2i07e	kitchen	t	2026-01-20 10:02:58.201842+00	\N	\N	t
3dea4017-0088-466c-a013-89a3461fca12	kjfdksdfjsd	lamnhatbo0123@gmail.com	$2b$10$wsO2riC/VB8wqblyNdVtaOmWCJD17p4ENQic8dh/f1y6cASnbGB.W	customer	f	2026-01-20 10:04:43.157799+00	\N	\N	t
900a56df-1e7b-4d1e-854f-7d8bf34972af	kjfdksdfjsd	lethanhphong123abi@gmail.com	$2b$10$9ss8IZ/x23OGx3zvNxZKDuTx6mfA0yjM.QK6N14/6QjGb0uI0TUgS	customer	f	2026-01-20 10:05:58.748463+00	\N	\N	t
21533cc1-5c8f-4da8-8f6e-21c1ea65e072	Lê Thanh Phong	lamnhatphong8605@gmail.com	$2b$10$rZgVjKO9xLjl1wJMwVKbA.zaCy/vYI6CeeoGUZLaYzkgyCfJvB8bW	customer	f	2026-01-20 10:23:54.446021+00	\N	\N	t
e374fab2-e6dc-4ee6-bdcb-acd21b84cff1	Nguyen Van Ang	an@gmail.com	$2b$10$L1VBmHLYBOEfYDnzyygqZedNRyaHZVOfKF26wj/0nxAtfIKLKaMIi	admin	t	2026-01-20 10:36:07.458076+00	\N	\N	t
1bbf8dc9-556f-48ad-b009-cc3191e3257a	LE PHONG	lethanhphong123abu@gmail.com	$2b$10$DDiLSrR17yx8lSOQXpuxwOk8c3fvVnocOxQ3dG2Zeq6n7tAcvdi6a	customer	f	2026-04-07 08:06:48.98759+00	\N	\N	t
56b34dcb-2b3f-47fd-87f1-1c1a5599a17a	Phong Lâm	admin@gmail.com	$2b$10$ngNNnHOq61ASxpOT4LBlB.fU1pzKA7knbfa5QG08ijkF1.iVPX4B6	admin	t	2026-01-11 10:48:43.896729+00	\N	https://res.cloudinary.com/ddmp7so4t/image/upload/v1768905562/smart-restaurant/acaacydjczjgvhgwy86v.jpg	t
2000c3e1-4cd7-4198-bbea-f3701644e504	Phong Thanh	phonglekkc1@gmail.com	GOOGLE_OAUTH	customer	f	2026-01-20 10:41:14.968038+00	\N	\N	t
daa74fd2-afa3-408a-b50b-f1ffa476d608	WAITER	waiter@gmail.com	$2b$10$Az/x/v0YTAUUaBtyfBIt.uF1ZIdvpqDIANlDrPt0k15juw27FYrza	waiter	t	2026-01-12 16:25:13.348183+00	\N	\N	t
5af5299c-a574-4258-9cdc-53db323686e5	No Cy	khoahocai123a@gmail.com	GOOGLE_OAUTH	customer	f	2026-01-21 06:11:19.482961+00	\N	\N	t
690537e3-a003-42c1-8c89-056489c47563	Kan Nguyễn Lê Quang	minpro111@gmail.com	GOOGLE_OAUTH	customer	t	2026-01-20 16:24:28.062252+00	\N	\N	t
637ad6c2-4ebe-4a34-9dee-4069973bf704	thuy nga	23120279@student.hcmus.edu.vn	$2b$10$Fj/cu38DmrLjxXjae3wcLuZehJLPZEYLqgdWPg/TNEfj1uTehv8zC	customer	t	2026-01-13 06:35:52.306785+00	\N	\N	t
\.


--
-- Name: bill_requests bill_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bill_requests
    ADD CONSTRAINT bill_requests_pkey PRIMARY KEY (id);


--
-- Name: bills bills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_code_key UNIQUE (code);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: email_verification_tokens email_verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_pkey PRIMARY KEY (id);


--
-- Name: menu_categories menu_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT menu_categories_name_key UNIQUE (name);


--
-- Name: menu_categories menu_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT menu_categories_pkey PRIMARY KEY (id);


--
-- Name: menu_item_modifier_groups menu_item_modifier_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item_modifier_groups
    ADD CONSTRAINT menu_item_modifier_groups_pkey PRIMARY KEY (menu_item_id, group_id);


--
-- Name: menu_item_photos menu_item_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item_photos
    ADD CONSTRAINT menu_item_photos_pkey PRIMARY KEY (id);


--
-- Name: menu_item_reviews menu_item_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item_reviews
    ADD CONSTRAINT menu_item_reviews_pkey PRIMARY KEY (id);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- Name: modifier_groups modifier_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modifier_groups
    ADD CONSTRAINT modifier_groups_pkey PRIMARY KEY (id);


--
-- Name: modifier_options modifier_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modifier_options
    ADD CONSTRAINT modifier_options_pkey PRIMARY KEY (id);


--
-- Name: order_item_modifiers order_item_modifiers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item_modifiers
    ADD CONSTRAINT order_item_modifiers_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: table_assignments table_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_assignments
    ADD CONSTRAINT table_assignments_pkey PRIMARY KEY (waiter_id, table_id);


--
-- Name: table_sessions table_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_sessions
    ADD CONSTRAINT table_sessions_pkey PRIMARY KEY (id);


--
-- Name: table_sessions table_sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_sessions
    ADD CONSTRAINT table_sessions_session_token_key UNIQUE (session_token);


--
-- Name: tables tables_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_pkey PRIMARY KEY (id);


--
-- Name: tables tables_table_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_table_number_key UNIQUE (table_number);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_bill_requests_pending; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bill_requests_pending ON public.bill_requests USING btree (status, created_at) WHERE ((status)::text = 'pending'::text);


--
-- Name: idx_bill_requests_table; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bill_requests_table ON public.bill_requests USING btree (table_id);


--
-- Name: idx_bills_stripe_payment_intent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bills_stripe_payment_intent_id ON public.bills USING btree (stripe_payment_intent_id) WHERE (stripe_payment_intent_id IS NOT NULL);


--
-- Name: idx_coupons_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coupons_active ON public.coupons USING btree (is_active, start_date, end_date);


--
-- Name: idx_coupons_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coupons_code ON public.coupons USING btree (code);


--
-- Name: idx_email_verify_tokenhash; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email_verify_tokenhash ON public.email_verification_tokens USING btree (token_hash);


--
-- Name: idx_email_verify_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email_verify_user ON public.email_verification_tokens USING btree (user_id);


--
-- Name: idx_menu_categories_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menu_categories_status ON public.menu_categories USING btree (status);


--
-- Name: idx_menu_item_photos_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menu_item_photos_item ON public.menu_item_photos USING btree (menu_item_id);


--
-- Name: idx_menu_items_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menu_items_category ON public.menu_items USING btree (category_id);


--
-- Name: idx_menu_items_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menu_items_status ON public.menu_items USING btree (status);


--
-- Name: idx_modifier_options_group; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_modifier_options_group ON public.modifier_options USING btree (group_id);


--
-- Name: idx_password_reset_tokens_token_hash; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_password_reset_tokens_token_hash ON public.password_reset_tokens USING btree (token_hash);


--
-- Name: idx_password_reset_tokens_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_password_reset_tokens_user_id ON public.password_reset_tokens USING btree (user_id);


--
-- Name: idx_refresh_tokens_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_tokens_token ON public.refresh_tokens USING btree (token);


--
-- Name: idx_reviews_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_item ON public.menu_item_reviews USING btree (menu_item_id);


--
-- Name: bill_requests bill_requests_handled_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bill_requests
    ADD CONSTRAINT bill_requests_handled_by_fkey FOREIGN KEY (handled_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: bill_requests bill_requests_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bill_requests
    ADD CONSTRAINT bill_requests_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.table_sessions(id) ON DELETE SET NULL;


--
-- Name: bill_requests bill_requests_table_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bill_requests
    ADD CONSTRAINT bill_requests_table_id_fkey FOREIGN KEY (table_id) REFERENCES public.tables(id) ON DELETE CASCADE;


--
-- Name: bills bills_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: bills bills_table_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_table_id_fkey FOREIGN KEY (table_id) REFERENCES public.tables(id);


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id) ON DELETE CASCADE;


--
-- Name: carts carts_table_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_table_id_fkey FOREIGN KEY (table_id) REFERENCES public.tables(id) ON DELETE SET NULL;


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: email_verification_tokens email_verification_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: menu_item_modifier_groups menu_item_modifier_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item_modifier_groups
    ADD CONSTRAINT menu_item_modifier_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.modifier_groups(id) ON DELETE CASCADE;


--
-- Name: menu_item_modifier_groups menu_item_modifier_groups_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item_modifier_groups
    ADD CONSTRAINT menu_item_modifier_groups_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id) ON DELETE CASCADE;


--
-- Name: menu_item_photos menu_item_photos_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item_photos
    ADD CONSTRAINT menu_item_photos_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id) ON DELETE CASCADE;


--
-- Name: menu_item_reviews menu_item_reviews_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item_reviews
    ADD CONSTRAINT menu_item_reviews_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id) ON DELETE CASCADE;


--
-- Name: menu_item_reviews menu_item_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item_reviews
    ADD CONSTRAINT menu_item_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: menu_items menu_items_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.menu_categories(id) ON DELETE CASCADE;


--
-- Name: modifier_options modifier_options_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modifier_options
    ADD CONSTRAINT modifier_options_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.modifier_groups(id) ON DELETE CASCADE;


--
-- Name: order_item_modifiers order_item_modifiers_modifier_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item_modifiers
    ADD CONSTRAINT order_item_modifiers_modifier_option_id_fkey FOREIGN KEY (modifier_option_id) REFERENCES public.modifier_options(id) ON DELETE SET NULL;


--
-- Name: order_item_modifiers order_item_modifiers_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item_modifiers
    ADD CONSTRAINT order_item_modifiers_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id) ON DELETE SET NULL;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders orders_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_bill_id_fkey FOREIGN KEY (bill_id) REFERENCES public.bills(id) ON DELETE SET NULL;


--
-- Name: orders orders_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.table_sessions(id);


--
-- Name: orders orders_table_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_table_id_fkey FOREIGN KEY (table_id) REFERENCES public.tables(id) ON DELETE SET NULL;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: table_assignments table_assignments_table_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_assignments
    ADD CONSTRAINT table_assignments_table_id_fkey FOREIGN KEY (table_id) REFERENCES public.tables(id) ON DELETE CASCADE;


--
-- Name: table_assignments table_assignments_waiter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_assignments
    ADD CONSTRAINT table_assignments_waiter_id_fkey FOREIGN KEY (waiter_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: table_sessions table_sessions_table_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_sessions
    ADD CONSTRAINT table_sessions_table_id_fkey FOREIGN KEY (table_id) REFERENCES public.tables(id) ON DELETE CASCADE;


--
-- Name: table_sessions table_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_sessions
    ADD CONSTRAINT table_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: tables tables_current_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_current_session_id_fkey FOREIGN KEY (current_session_id) REFERENCES public.table_sessions(id) ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: TABLE bill_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bill_requests TO anon;
GRANT ALL ON TABLE public.bill_requests TO authenticated;
GRANT ALL ON TABLE public.bill_requests TO service_role;


--
-- Name: TABLE bills; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bills TO anon;
GRANT ALL ON TABLE public.bills TO authenticated;
GRANT ALL ON TABLE public.bills TO service_role;


--
-- Name: TABLE cart_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cart_items TO anon;
GRANT ALL ON TABLE public.cart_items TO authenticated;
GRANT ALL ON TABLE public.cart_items TO service_role;


--
-- Name: TABLE carts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.carts TO anon;
GRANT ALL ON TABLE public.carts TO authenticated;
GRANT ALL ON TABLE public.carts TO service_role;


--
-- Name: TABLE coupons; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.coupons TO anon;
GRANT ALL ON TABLE public.coupons TO authenticated;
GRANT ALL ON TABLE public.coupons TO service_role;


--
-- Name: TABLE email_verification_tokens; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.email_verification_tokens TO anon;
GRANT ALL ON TABLE public.email_verification_tokens TO authenticated;
GRANT ALL ON TABLE public.email_verification_tokens TO service_role;


--
-- Name: TABLE menu_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.menu_categories TO anon;
GRANT ALL ON TABLE public.menu_categories TO authenticated;
GRANT ALL ON TABLE public.menu_categories TO service_role;


--
-- Name: TABLE menu_item_modifier_groups; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.menu_item_modifier_groups TO anon;
GRANT ALL ON TABLE public.menu_item_modifier_groups TO authenticated;
GRANT ALL ON TABLE public.menu_item_modifier_groups TO service_role;


--
-- Name: TABLE menu_item_photos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.menu_item_photos TO anon;
GRANT ALL ON TABLE public.menu_item_photos TO authenticated;
GRANT ALL ON TABLE public.menu_item_photos TO service_role;


--
-- Name: TABLE menu_item_reviews; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.menu_item_reviews TO anon;
GRANT ALL ON TABLE public.menu_item_reviews TO authenticated;
GRANT ALL ON TABLE public.menu_item_reviews TO service_role;


--
-- Name: TABLE menu_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.menu_items TO anon;
GRANT ALL ON TABLE public.menu_items TO authenticated;
GRANT ALL ON TABLE public.menu_items TO service_role;


--
-- Name: TABLE modifier_groups; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.modifier_groups TO anon;
GRANT ALL ON TABLE public.modifier_groups TO authenticated;
GRANT ALL ON TABLE public.modifier_groups TO service_role;


--
-- Name: TABLE modifier_options; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.modifier_options TO anon;
GRANT ALL ON TABLE public.modifier_options TO authenticated;
GRANT ALL ON TABLE public.modifier_options TO service_role;


--
-- Name: TABLE order_item_modifiers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.order_item_modifiers TO anon;
GRANT ALL ON TABLE public.order_item_modifiers TO authenticated;
GRANT ALL ON TABLE public.order_item_modifiers TO service_role;


--
-- Name: TABLE order_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.order_items TO anon;
GRANT ALL ON TABLE public.order_items TO authenticated;
GRANT ALL ON TABLE public.order_items TO service_role;


--
-- Name: TABLE orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.orders TO anon;
GRANT ALL ON TABLE public.orders TO authenticated;
GRANT ALL ON TABLE public.orders TO service_role;


--
-- Name: TABLE password_reset_tokens; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.password_reset_tokens TO anon;
GRANT ALL ON TABLE public.password_reset_tokens TO authenticated;
GRANT ALL ON TABLE public.password_reset_tokens TO service_role;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.refresh_tokens TO anon;
GRANT ALL ON TABLE public.refresh_tokens TO authenticated;
GRANT ALL ON TABLE public.refresh_tokens TO service_role;


--
-- Name: TABLE table_assignments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.table_assignments TO anon;
GRANT ALL ON TABLE public.table_assignments TO authenticated;
GRANT ALL ON TABLE public.table_assignments TO service_role;


--
-- Name: TABLE table_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.table_sessions TO anon;
GRANT ALL ON TABLE public.table_sessions TO authenticated;
GRANT ALL ON TABLE public.table_sessions TO service_role;


--
-- Name: TABLE tables; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tables TO anon;
GRANT ALL ON TABLE public.tables TO authenticated;
GRANT ALL ON TABLE public.tables TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- PostgreSQL database dump complete
--

\unrestrict EHKPdXtx8WWvATqQafvjapRgq3SqpoaN8x7Eb5jLvGKteMuTLJHJnIw0FfcfZc6

