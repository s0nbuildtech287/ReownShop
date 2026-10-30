package com.reownshop.account;

import com.reownshop.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "addresses")
public class Address {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id") private User user;
    @Column(nullable = false, length = 120) private String recipient;
    @Column(nullable = false, length = 20) private String phone;
    @Column(nullable = false, length = 100) private String province;
    @Column(nullable = false, length = 100) private String district;
    @Column(nullable = false, length = 100) private String ward;
    @Column(nullable = false, length = 255) private String detail;
    @Column(name = "is_default", nullable = false) private boolean defaultAddress;
    protected Address() {}
    public Address(User user, String recipient, String phone, String province, String district, String ward, String detail, boolean defaultAddress) {
        this.user = user; this.recipient = recipient; this.phone = phone; this.province = province; this.district = district; this.ward = ward; this.detail = detail; this.defaultAddress = defaultAddress;
    }
    public Long getId() { return id; }
    public String getRecipient() { return recipient; }
    public String getPhone() { return phone; }
    public String getProvince() { return province; }
    public String getDistrict() { return district; }
    public String getWard() { return ward; }
    public String getDetail() { return detail; }
    public boolean isDefaultAddress() { return defaultAddress; }
    public void makeDefault() { defaultAddress = true; }
    public void removeDefault() { defaultAddress = false; }
}
