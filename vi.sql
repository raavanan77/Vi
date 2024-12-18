PGDMP                 	        |            vi    15.10 (Debian 15.10-0+deb12u1)    15.10 (Debian 15.10-0+deb12u1)     $           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            %           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            &           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            '           1262    16409    vi    DATABASE     h   CREATE DATABASE vi WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_IN';
    DROP DATABASE vi;
                postgres    false            �            1259    16467 
   devicelist    TABLE     �   CREATE TABLE public.devicelist (
    name text,
    rpcip text,
    rpcport integer,
    lan_iface text,
    wan_iface text,
    wlan_iface text,
    extraprop jsonb
);
    DROP TABLE public.devicelist;
       public         heap    postgres    false            �            1259    16462    testcase    TABLE     G   CREATE TABLE public.testcase (
    name text,
    testdetails jsonb
);
    DROP TABLE public.testcase;
       public         heap    postgres    false            �            1259    16450    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    username text NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16449    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    215            (           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    214            �           2604    16453    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215            !          0    16467 
   devicelist 
   TABLE DATA           g   COPY public.devicelist (name, rpcip, rpcport, lan_iface, wan_iface, wlan_iface, extraprop) FROM stdin;
    public          postgres    false    217   �                  0    16462    testcase 
   TABLE DATA           5   COPY public.testcase (name, testdetails) FROM stdin;
    public          postgres    false    216                     0    16450    users 
   TABLE DATA           >   COPY public.users (id, email, password, username) FROM stdin;
    public          postgres    false    215          )           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 1, true);
          public          postgres    false    214            �           2606    16459    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    215            �           2606    16457    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    215            �           2606    16461    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    215            !   ?   x��q������w��t��447�34�3�322�4100�L-� ��9�y�1~\1z\\\ ŅX             x������ � �         3   x�3�,�L�K-�(NM-�H,J�u�/-�����K���4.+S������� j��     