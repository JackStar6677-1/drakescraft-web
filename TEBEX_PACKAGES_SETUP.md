# 📦 GUÍA DE CONFIGURACIÓN DE PAQUETES TEBEX - DRAKESCRAFT

Copia y pega la siguiente información campo por campo en tu panel de Tebex (Webstore -> Packages).

---

## 🟣 RANGOS MENSUALES (/fly mientras dura el rango)

### 1. NEÓN (Rango Mensual)

*   **Name:** `NEÓN (Rango Mensual)`
*   **Price:** `4.99`
*   **Description (Short):** Rango mensual con /fly y perks básicos.
*   **Description (Richtext/HTML):**
    ```html
    <p>✅ Duración: <strong>30 días</strong><br>
    ✅ Acceso a <strong>/fly</strong> mientras el rango esté activo<br>
    ✅ +1 <strong>/sethome</strong> adicional<br>
    ✅ <strong>+5%</strong> de dinero extra en Jobs<br>
    ✅ Acceso a <strong>/hat</strong><br>
    ✅ Prefijo exclusivo <strong>[Neón]</strong> en chat y TAB<br>
    ✅ Ligera prioridad en la cola de conexión</p>

    <p>🔔 El rango se aplica automáticamente al conectarte después de la compra.<br>
    🔔 <strong>/fly</strong> solo está disponible mientras dure el rango (30 días).</p>
    ```
*   **Commands (Game Server - Execute as Console):**
    ```text
    lp user {username} parent removetemp neon
    lp user {username} parent removetemp orbital
    lp user {username} parent removetemp singularidad
    lp user {username} parent addtemp neon 30d
    ```

---

### 2. ORBITAL (Rango Mensual)

*   **Name:** `ORBITAL (Rango Mensual)`
*   **Price:** `9.99`
*   **Description (Short):** Rango mensual avanzado con más homes y bonus.
*   **Description (Richtext/HTML):**
    ```html
    <p>✅ Duración: <strong>30 días</strong><br>
    ✅ Todo lo incluido en <strong>NEÓN</strong><br>
    ✅ <strong>+3 /sethome</strong> adicionales<br>
    ✅ <strong>+10%</strong> de dinero extra en Jobs<br>
    ✅ <strong>1 llave de caja ÉPICA</strong> semanal (se entregará dentro del servidor)<br>
    ✅ Acceso a <strong>/workbench</strong><br>
    ✅ Permite <strong>/nickname</strong> con colores<br>
    ✅ Prefijo exclusivo <strong>[Orbital]</strong></p>

    <p>🔔 <strong>/fly</strong> solo está disponible mientras dure el rango (30 días).</p>
    ```
*   **Commands:**
    ```text
    lp user {username} parent removetemp neon
    lp user {username} parent removetemp orbital
    lp user {username} parent removetemp singularidad
    lp user {username} parent addtemp orbital 30d
    # TODO: añadir comando para llave épica si aplica
    ```

---

### 3. SINGULARIDAD (Rango Mensual)

*   **Name:** `SINGULARIDAD (Rango Mensual)`
*   **Price:** `14.99`
*   **Description (Short):** Rango mensual top con grandes bonus y recompensas.
*   **Description (Richtext/HTML):**
    ```html
    <p>✅ Duración: <strong>30 días</strong><br>
    ✅ Todo lo incluido en <strong>ORBITAL</strong><br>
    ✅ <strong>+5 /sethome</strong> adicionales<br>
    ✅ <strong>+20%</strong> de dinero extra en Jobs<br>
    ✅ <strong>1 llave de caja LEGENDARIA</strong> semanal<br>
    ✅ Acceso a <strong>warp VIP</strong> exclusivo<br>
    ✅ Menor cooldown en <strong>/rtp</strong><br>
    ✅ Prefijo exclusivo <strong>[Singularidad]</strong></p>
    ```
*   **Commands:**
    ```text
    lp user {username} parent removetemp neon
    lp user {username} parent removetemp orbital
    lp user {username} parent removetemp singularidad
    lp user {username} parent addtemp singularidad 30d
    # TODO: añadir comando para llave legendaria
    ```

---

## 🟡 RANGOS PERMANENTES

### 4. APOLO (Rango Permanente)

*   **Name:** `APOLO (Rango Permanente)`
*   **Price:** `14.99`
*   **Description:**
    ```html
    <p>♾ <strong>Rango PERMANENTE</strong><br>
    ✅ +2 <strong>/sethome</strong> adicionales<br>
    ✅ <strong>+5%</strong> de dinero extra en Jobs<br>
    ✅ Acceso a <strong>/hat</strong><br>
    ✅ Acceso a <strong>/back</strong><br>
    ✅ Partículas simples configurables<br>
    ✅ Prefijo exclusivo <strong>[Apolo]</strong></p>
    ```
*   **Commands:**
    ```text
    lp user {username} parent add apolo
    ```

---

### 5. CRONOS (Rango Permanente)

*   **Name:** `CRONOS (Rango Permanente)`
*   **Price:** `24.99`
*   **Description:**
    ```html
    <p>♾ <strong>Rango PERMANENTE</strong><br>
    ✅ Todo lo incluido en <strong>APOLO</strong><br>
    ✅ <strong>+5 /sethome</strong> adicionales<br>
    ✅ <strong>+10%</strong> de dinero extra en Jobs<br>
    ✅ Acceso a <strong>/enderchest</strong><br>
    ✅ Acceso a <strong>/repair</strong> (con cooldown)<br>
    ✅ Acceso a <strong>/anvil</strong> virtual<br>
    ✅ Prefijo exclusivo <strong>[Cronos]</strong></p>
    ```
*   **Commands:**
    ```text
    lp user {username} parent remove apolo
    lp user {username} parent add cronos
    ```

---

### 6. DRAGÓN ETERNO (Rango Permanente)

*   **Name:** `DRAGÓN ETERNO (Rango Permanente)`
*   **Price:** `39.99`
*   **Description:**
    ```html
    <p>♾ <strong>Rango PERMANENTE</strong><br>
    ✅ Todo lo incluido en <strong>CRONOS</strong><br>
    ✅ <strong>+8 /sethome</strong> adicionales<br>
    ✅ <strong>+15%</strong> de dinero extra en Jobs<br>
    ✅ <strong>1 llave ÉPICA</strong> semanal<br>
    ✅ Acceso a <strong>warp sala VIP</strong><br>
    ✅ Armadura cosmética exclusiva temática de dragón<br>
    ✅ Prefijo exclusivo <strong>[Dragón]</strong></p>
    ```
*   **Commands:**
    ```text
    lp user {username} parent remove apolo
    lp user {username} parent remove cronos
    lp user {username} parent add dragonetero
    ```

---

### 7. DEUS MACHINA (Rango Permanente)

*   **Name:** `DEUS MACHINA (Rango Permanente)`
*   **Price:** `59.99`
*   **Description:**
    ```html
    <p>♾ <strong>Rango PERMANENTE</strong><br>
    ✅ Todo lo incluido en <strong>DRAGÓN ETERNO</strong><br>
    ✅ <strong>+10 /sethome</strong> adicionales<br>
    ✅ <strong>+20%</strong> de dinero extra en Jobs<br>
    ✅ <strong>1 llave LEGENDARIA</strong> mensual<br>
    ✅ Tags exclusivos en TAB y chat<br>
    ✅ Efecto especial de entrada al servidor<br>
    ✅ Prefijo exclusivo <strong>[Deus]</strong></p>
    ```
*   **Commands:**
    ```text
    lp user {username} parent remove apolo
    lp user {username} parent remove cronos
    lp user {username} parent remove dragonetero
    lp user {username} parent add deusmachina
    ```

---

## 💰 PACKS DE DINERO

### 8-12. Créditos Variados

*   **Créditos Cuánticos I (2.99):** `eco give {username} 250000`
*   **Créditos Cuánticos II (4.99):** `eco give {username} 750000`
*   **Créditos Galácticos I (9.99):** `eco give {username} 2500000`
*   **Créditos Galácticos II (19.99):** `eco give {username} 7500000`
*   **Banco del Dragón (34.99):** `eco give {username} 15000000`

---

## 🧰 KITS ESPECIALES

### 13-18. Kits

*   **Kit Técnico Cuántico (6.99):** `kit tecnicocuantico {username}`
*   **Kit Arquitecto Galáctico (4.99):** `kit arquitectogalactico {username}`
*   **Kit AgroTech (4.99):** `kit agrotech {username}`
*   **Kit Núcleo Planetario (5.99):** `kit nucleoplanetario {username}`
*   **Kit Cazador de Estrellas (5.99):** `kit cazadordestrellas {username}`
*   **Kit Dragón Supremo (14.99):** `kit dragonsupremo {username}`

---

## 🛡 Categoría: Protecciones VIP

### 1️⃣ Núcleo Protector 100 (VIP)

*   **Name:** `Núcleo Protector 100 (VIP)`
*   **Price:** `24.99`
*   **Description:**
    ```html
    <p>🛡 <strong>Núcleo Protector 100 (VIP)</strong><br>
    ✔ Crea una región de protección de hasta <strong>100 bloques de radio</strong>.<br>
    ✔ Perfecto para bases grandes y zonas seguras.<br>
    🔔 Recibirás un bloque especial. Colócalo para reclamar la zona.</p>
    ```
*   **Commands:**
    ```text
    ps give vip100 {username} 1
    ```

### 2️⃣ Núcleo Protector 200 (VIP+)

*   **Name:** `Núcleo Protector 200 (VIP+)`
*   **Price:** `39.99`
*   **Description:**
    ```html
    <p>🛡 <strong>Núcleo Protector 200 (VIP+)</strong><br>
    ✔ Crea una región de hasta <strong>200 bloques de radio</strong>.<br>
    ✔ Ideal para <strong>ciudades</strong> y mega-bases.<br>
    🔔 Recibirás un bloque exclusivo de Protección VIP+.</p>
    ```
*   **Commands:**
    ```text
    ps give vip200 {username} 1
    ```

### 3️⃣ Dominio del Dragón 400 (Élite)

*   **Name:** `Dominio del Dragón 400 (Élite)`
*   **Price:** `69.99`
*   **Description:**
    ```html
    <p>🐉 <strong>Dominio del Dragón 400 (Élite)</strong><br>
    ✔ Crea una región colosal de hasta <strong>400 bloques de radio</strong>.<br>
    ✔ Aproximadamente <strong>800x800 bloques</strong> protegidos.<br>
    ✔ Máxima defensa para clanes y ciudades capitales.<br>
    🔔 Recibirás un bloque legendario de protección.</p>
    ```
*   **Commands:**
    ```text
    ps give vip400 {username} 1
    ```
