package com.reownshop.account;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.reownshop.user.User;

@RestController
@RequestMapping("/api/v1/account")
public class AccountController {
    private final AccountService accountService;
    public AccountController(AccountService accountService) { this.accountService = accountService; }
    @GetMapping("/addresses") public AccountDtos.AddressList addresses(@AuthenticationPrincipal User user) { return accountService.addresses(user); }
    @PostMapping("/addresses") @ResponseStatus(HttpStatus.CREATED)
    public AccountDtos.AddressResponse add(@AuthenticationPrincipal User user, @RequestBody AccountDtos.AddressRequest request) { return accountService.addAddress(user, request); }
    @DeleteMapping("/addresses/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal User user, @PathVariable Long id) { accountService.deleteAddress(user, id); }
    @GetMapping("/settings") public AccountDtos.SettingsResponse settings(@AuthenticationPrincipal User user) { return accountService.settings(user); }
    @PutMapping("/settings") public AccountDtos.SettingsResponse update(@AuthenticationPrincipal User user, @RequestBody AccountDtos.SettingsRequest request) { return accountService.updateSettings(user, request); }
}
