package com.reownshop.account;

import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.reownshop.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_settings")
public class UserSettings {
    @Id private Long userId;
    @OneToOne(fetch = FetchType.LAZY, optional = false) @MapsId @JoinColumn(name = "user_id") private User user;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "notify_prefs", nullable = false, columnDefinition = "jsonb") private Map<String, Boolean> notifyPrefs;
    @Column(nullable = false, length = 10) private String theme = "SYSTEM";
    protected UserSettings() {}
    public UserSettings(User user, Map<String, Boolean> notifyPrefs, String theme) { this.user = user; this.notifyPrefs = notifyPrefs; this.theme = theme; }
    public Map<String, Boolean> getNotifyPrefs() { return notifyPrefs; }
    public String getTheme() { return theme; }
    public void update(Map<String, Boolean> notifyPrefs, String theme) { this.notifyPrefs = notifyPrefs; this.theme = theme; }
}
