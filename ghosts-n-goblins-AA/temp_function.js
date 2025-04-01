    handleWeaponThrow() {
        // No permitir lanzamiento si está muerto
        if (this.isDead) return;
        
        // Verificar si se presionó la tecla de espacio y si el jugador puede lanzar
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && !this.isThrowingWeapon) {
            console.log('Lanzando arma:', this.currentWeapon);
            
            // Marcar que estamos lanzando
            this.isThrowingWeapon = true;
            
            // Obtener dirección y posición
            const direction = this.facingLeft ? -1 : 1;
            const posX = this.player.x + (direction * 20);
            const posY = this.player.y - 10; // Ajuste para que salga a altura adecuada
            
            try {
                // Crear el arma y añadirla al grupo
                const weapon = new Weapon(this, posX, posY, this.currentWeapon);
                this.weapons.add(weapon);
                
                // Iniciar el movimiento del arma
                weapon.fire(posX, posY, direction);
                
                console.log('Arma creada y lanzada:', this.currentWeapon, 'en dirección:', direction);
                
                // Reproducir animación de lanzamiento
                this.player.anims.play('throw', true);
                
                // Reproducir sonido de lanzamiento
                if (this.audioManager) {
                    this.audioManager.playSfx('throw', { volume: 0.4 });
                    console.log('Sonido de lanzamiento reproducido');
                }
            } catch (error) {
                console.error('Error al crear arma:', error);
                // En caso de error, resetear el estado
                this.isThrowingWeapon = false;
            }
            
            // La animación 'throw' tiene un evento de finalización que resetea isThrowingWeapon
            // Pero añadimos un temporizador por seguridad
            this.time.delayedCall(500, () => {
                if (this.isThrowingWeapon && !this.isDead) {
                    console.log('Restaurando estado de lanzamiento por timeout');
                    this.isThrowingWeapon = false;
                }
            });
        }
    }
    
    // Método para actualizar información de depuración
    updateDebugInfo() {
        try {
            if (!this.debugText) return;
            
            // Recopilar información del jugador
            const playerInfo = {
                x: Math.round(this.player.x),
                y: Math.round(this.player.y),
                vx: Math.round(this.player.body.velocity.x),
