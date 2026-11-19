class SocketHandlers {
    constructor(io) {
        this.io = io;
    }

    handleStatsUpdate(updatedStats) {
        this.io.broadcastToDashboard('stats_update', {
            type: 'stats',
            data: updatedStats,
            message: 'Donation statistics updated'
        });
        console.log('📊 Stats update broadcasted');
    }

    handleCampaignsUpdate(updatedCampaigns) {
        this.io.broadcastToDashboard('campaigns_update', {
            type: 'campaigns',
            data: updatedCampaigns,
            message: 'Campaign data updated'
        });
        console.log('🎯 Campaigns update broadcasted');
    }

    handleNewDonation(donation) {
        this.io.broadcastToDashboard('donations_update', {
            type: 'new_donation',
            data: [donation],
            message: 'New donation received'
        });
        console.log('💰 New donation broadcasted');
    }

    handleDonorsUpdate(donorStats) {
        this.io.broadcastToDashboard('donors_update', {
            type: 'donors',
            data: donorStats,
            message: 'Donor statistics updated'
        });
        console.log('👥 Donors update broadcasted');
    }

    handlePaymentsUpdate(paymentStats) {
        this.io.broadcastToDashboard('payments_update', {
            type: 'payments',
            data: paymentStats,
            message: 'Payment statistics updated'
        });
        console.log('💳 Payments update broadcasted');
    }

    handleGoatsUpdate(goatAnalytics) {
        this.io.broadcastToDashboard('goats_update', {
            type: 'goats',
            data: goatAnalytics,
            message: 'Goat analytics updated'
        });
        console.log('🐐 Goats update broadcasted');
    }

    sendSystemAlert(alert) {
        this.io.broadcastToDashboard('system_alert', {
            type: 'alert',
            data: alert,
            severity: alert.severity || 'info'
        });
        console.log('🚨 System alert sent:', alert.message);
    }

    getConnectionStats() {
        return this.io.getConnectionStats();
    }
}

export default SocketHandlers;